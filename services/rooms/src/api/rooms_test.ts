import 'jasmine';

import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as rooms from './rooms';
import * as roomsDb from '../services/rooms_db_client';
import Room from '../models/room';

describe('rooms', () => {
    describe('create()', () => {
        it('responds HTTP Created with the new Room', async () => {
            spyOn(roomsDb, 'create').and.returnValue(Promise.resolve(new Room({
                id: 0,
                name: 'foo',
            })));

            const res = await rooms.create({
                body: {
                    name: 'foo',
                },
            } as Request);

            expect(roomsDb.create).toHaveBeenCalledWith('foo');

            expect(res.status).toBe(HttpStatus.CREATED);
            expect(res.contentType).toBe('application/json');
            expect(JSON.parse(res.body)).toEqual({
                id: 0,
                name: 'foo',
            });
        });

        it('responds HTTP Bad Request when no body is given', async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create({} as Request);

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when body is not a JSON object', async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create({
                body: 'test',
            } as Request);

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when not given a "name" field', async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create({
                body: {
                    foo: 'bar',
                },
            } as Request);

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when not given a string "name" field', async () => {
            spyOn(roomsDb, 'create');

            const booleanRes = await rooms.create({
                body: {
                    name: true,
                },
            } as Request);
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(booleanRes.status).toBe(HttpStatus.BAD_REQUEST);
            
            const numberRes = await rooms.create({
                body: {
                    name: 5,
                },
            } as Request);
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(numberRes.status).toBe(HttpStatus.BAD_REQUEST);
            
            const nullRes = await rooms.create({
                body: {
                    name: null,
                },
            } as Request);
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(nullRes.status).toBe(HttpStatus.BAD_REQUEST);

            const objRes = await rooms.create({
                body: {
                    name: {
                        foo: 'bar',
                    },
                },
            } as Request);
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(objRes.status).toBe(HttpStatus.BAD_REQUEST);

            const listRes = await rooms.create({
                body: {
                    name: ['foo', 'bar', 'baz'],
                },
            } as Request);
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(listRes.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe('list()', () => {
        it('responds HTTP OK with an empty list when no rooms exist', async () => {
            spyOn(roomsDb, 'list').and.returnValue(Promise.resolve([]));

            const res = await rooms.list();

            expect(roomsDb.list).toHaveBeenCalledWith(/* nothing */);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.contentType).toBe('application/json');
            expect(JSON.parse(res.body)).toEqual([]);
        });

        it('responds HTTP OK with all the currently available rooms', async () => {
            spyOn(roomsDb, 'list').and.returnValue(Promise.resolve([
                new Room({ id: 0, name: 'foo' }),
                new Room({ id: 1, name: 'bar' }),
            ]));

            const res = await rooms.list();

            expect(roomsDb.list).toHaveBeenCalledWith(/* nothing */);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.contentType).toBe('application/json');
            expect(JSON.parse(res.body)).toEqual([{
                id: 0,
                name: 'foo',
            }, {
                id: 1,
                name: 'bar',
            }]);
        });
    });
});
