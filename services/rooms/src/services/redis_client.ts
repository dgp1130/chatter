import * as redis from 'redis';
import { promisify } from 'util';

/** The exported client API. */
export type DbClient = ReturnType<typeof initialize>;

/** Creates a client for the given host and port. */
export function initialize(dbClient: redis.RedisClient) /* infer return type */ {
    const hmSet = promisify(dbClient.hmset.bind(dbClient));
    type ZAdd = (key: string, score: number, value: string) => Promise<number>;
    type ZRangeByScore = (key: string, min: string|number, max: string|number) => Promise<string[]>;
    return {
        get: promisify(dbClient.get).bind(dbClient),
        set: promisify(dbClient.set).bind(dbClient),
        incr: promisify(dbClient.incr).bind(dbClient),
        multi: dbClient.multi.bind(dbClient),
        zAdd: promisify(dbClient.zadd.bind(dbClient)) as ZAdd,
        zRangeByScore: promisify(dbClient.zrangebyscore.bind(dbClient)) as ZRangeByScore,
        hGetAll: promisify(dbClient.hgetall.bind(dbClient)),
        hmSet: (...args: Parameters<typeof hmSet>[0]) => hmSet(args),
        expire: promisify(dbClient.expire.bind(dbClient)),
        ttl: promisify(dbClient.ttl.bind(dbClient)),
        flushAll: promisify(dbClient.flushall.bind(dbClient)),
    };
}

/** Executes the given multi operation and returns the result as a {@link Promise}. */
export function execMulti(multi: redis.Multi): Promise<any[]> {
    return new Promise((resolve, reject) => {
        multi.exec((err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
}
