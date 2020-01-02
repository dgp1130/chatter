import * as redisMock from 'redis-mock';
import { initialize, execMulti } from './redis_client';

const fakeClient = redisMock.createClient();
describe('redis_client', () => {
    afterEach((done) => {
        fakeClient.flushall(done);
    });

    describe('wraps Redis API', () => {
        it('get/set', async () => {
            const client = initialize(fakeClient);

            await client.set('foo', 'bar');

            const value = await client.get('foo');
            expect(value).toBe('bar');
        });

        it('incr', async () => {
            const client = initialize(fakeClient);

            const first = await client.incr('foo');
            expect(first).toBe(1);

            const second = await client.incr('foo');
            expect(second).toBe(2);
        });

        it('multi', async () => {
            const client = initialize(fakeClient);

            const value = await execMulti(client.multi()
                .incr('foo')
                .incr('foo')
                .incr('foo'),
            );
            
            expect(value).toEqual([ 1, 2, 3 ]);
        });

        it('zadd/zrangebyscore', async () => {
            const client = initialize(fakeClient);

            await client.zAdd('foo', 1, 'hello');
            await client.zAdd('foo', 2, 'world');

            const range = await client.zRangeByScore(
                'foo' /* key */,
                '-inf' /* min */,
                '+inf' /* max */,
            );

            expect(range).toEqual([ 'hello', 'world' ]);
        });

        it('hmset/hgetall', async () => {
            const client = initialize(fakeClient);

            // Initialize some dummy data.
            await client.hmSet(
                'test' /* key */,
                'foo' /* prop */, 'bar' /* value */,
                'hello' /* prop */, 'world' /* value */,
            );

            const hashMap = await client.hGetAll('test');

            expect(hashMap).toEqual({
                foo: 'bar',
                hello: 'world',
            });
        });

        it('expire/ttl', async () => {
            const client = initialize(fakeClient);

            await client.set('foo', 'bar');
            await client.expire('foo', 5);
            
            const ttl = await client.ttl('foo');

            // No good way to stop time from progressing in redis-mock, so we can only do an
            // approximate match: https://github.com/yeahoffline/redis-mock/issues/127.
            expect(ttl).toBeCloseTo(5);
        });

        it('flushall', async () => {
            const client = initialize(fakeClient);

            // Initialize some dummy data.
            await client.hmSet(
                'test' /* key */,
                'foo' /* prop */, 'bar' /* value */,
                'hello' /* prop */, 'world' /* value */,
            );

            const hashMap = await client.hGetAll('test');
            expect(hashMap).toEqual({
                foo: 'bar',
                hello: 'world',
            });

            await client.flushAll();

            const flushedHashMap = await client.hGetAll('test');
            expect(flushedHashMap).toBeNull();
        });
    });
});
