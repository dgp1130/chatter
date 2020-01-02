import { createClient } from 'redis-mock';
import * as dbClient from './redis_client';

/** Creates a fake, in-memory version of the database client for testing purposes. */
export function createFakeClient() {
    return dbClient.initialize(createClient());
}
