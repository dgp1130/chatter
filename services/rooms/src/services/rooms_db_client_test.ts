import { createFakeClient } from './redis_client_fake';
import * as dbClient from './db_client';
import * as roomsDb from './rooms_db_client';
import Room from '../models/room';

const SECS_PER_DAY = 86_400;

const fakeClient = createFakeClient();
describe('rooms_db_client', () => {
    beforeEach(() => {
        spyOn(dbClient, 'getClient').and.returnValue(fakeClient);
    });

    afterEach(async () => {
        await fakeClient.flushAll();
    });

    describe('create()', () => {
        it('resolves with a Room created on the backend database with the given name', async () => {
            await fakeClient.set('rooms.currId', '10');

            const room = await roomsDb.create('foo');

            const dbRoomIds = await fakeClient.zRangeByScore('rooms.byCreationTimestamp', 0, Date.now());
            expect(dbRoomIds).toEqual(['11']);

            const dbRoom = await fakeClient.hGetAll('rooms.byId.11');
            expect(dbRoom).toEqual({
                id: '11',
                name: 'foo',
            });

            expect(room).toEqual(new Room({
                id: 11,
                name: 'foo',
            }));
        });

        it('throws an error when unable to increment the current ID', async () => {
            const err = new Error('Uh oh, spaghettiohs!');
            spyOn(fakeClient, 'incr').and.returnValue(Promise.reject(err));
            
            await expectAsync(roomsDb.create('foo')).toBeRejectedWith(err);
        });

        it('throws an error when unable to store the created room', async () => {
            const err = new Error('Uh oh, spaghettiohs!');
            spyOn(dbClient, 'execMulti').and.returnValue(Promise.reject(err));
            
            await expectAsync(roomsDb.create('foo')).toBeRejectedWith(err);
        });

        it('resolves with a Room which expires in 24 hours', async () => {
            await roomsDb.create('foo');

            const ttl = await fakeClient.ttl('rooms.byId.1');

            // No good way to stop time from progressing in redis-mock, so we can only do an
            // approximate match: https://github.com/yeahoffline/redis-mock/issues/127.
            expect(ttl).toBeCloseTo(SECS_PER_DAY);
        });
    });

    describe('list()', () => {
        it('resolves with the list of Rooms present in the backend database', async () => {
            // This should stub a constant time, but there is no effective way to do that with
            // redis-mock. See: https://github.com/yeahoffline/redis-mock/issues/127.
            const now = Date.now();
            await fakeClient.zAdd('rooms.byCreationTimestamp', now, '5');
            await fakeClient.zAdd('rooms.byCreationTimestamp', now, '6');

            await fakeClient.hmSet('rooms.byId.5', 'id', 5, 'name', 'Foo');
            await fakeClient.hmSet('rooms.byId.6', 'id', 6, 'name', 'Bar');

            await expectAsync(roomsDb.list()).toBeResolvedTo([
                new Room({
                    id: 5,
                    name: 'Foo',
                }),
                new Room({
                    id: 6,
                    name: 'Bar',
                }),
            ]);
        });

        it('ignores expired Rooms', async () => {
            // This should stub a constant time, but there is no effective way to do that with
            // redis-mock. See: https://github.com/yeahoffline/redis-mock/issues/127.
            const nowSecs = Date.now() / 1000;
            await fakeClient.zAdd(
                'rooms.byCreationTimestamp', nowSecs - SECS_PER_DAY - 100 /* fudge factor */, '5');
            await fakeClient.zAdd('rooms.byCreationTimestamp', nowSecs, '6');

            await fakeClient.hmSet('rooms.byId.5', 'id', 5, 'name', 'Foo');
            await fakeClient.hmSet('rooms.byId.6', 'id', 6, 'name', 'Bar');

            await expectAsync(roomsDb.list()).toBeResolvedTo([
                // Foo room is too old and should not be listed.
                new Room({
                    id: 6,
                    name: 'Bar',
                }),
            ]);
        });

        it('rejects when database fails to list recently created Rooms', async () => {
            const err = new Error('Uh oh, spaghettiohs!');
            spyOn(fakeClient, 'zRangeByScore').and.returnValue(Promise.reject(err));

            await expectAsync(roomsDb.list()).toBeRejectedWith(err);
        });

        it('drops Rooms which fail to be loaded from the database', async () => {
            // This should stub a constant time, but there is no effective way to do that with
            // redis-mock. See: https://github.com/yeahoffline/redis-mock/issues/127.
            const now = Date.now();
            await fakeClient.zAdd('rooms.byCreationTimestamp', now, '5');
            await fakeClient.zAdd('rooms.byCreationTimestamp', now, '6');
            await fakeClient.zAdd('rooms.byCreationTimestamp', now, '7');

            await fakeClient.hmSet('rooms.byId.5', 'id', 5, 'name', 'Foo');
            // No Room exists at rooms.byId.6 to simulate an error.
            await fakeClient.hmSet('rooms.byId.7', 'id', 7, 'name', 'Baz');

            await expectAsync(roomsDb.list()).toBeResolvedTo([
                new Room({
                    id: 5,
                    name: 'Foo',
                }),
                new Room({
                    id: 7,
                    name: 'Baz',
                }),
            ]);
        });
    });
});