import { initialize, DbClient } from './redis_client';
import { parseConfig } from '../utils/db_client_config';
import { createClient } from 'redis';

// Re-export multi API for atomic operations.
export { execMulti } from './redis_client';

// Singleton database client for use through the service.
let client: DbClient|undefined;

/** Returns a re-usable database client based on global configuration. */
export function getClient(): DbClient {
    // Lazy load client from global configuration.
    if (!client) {
        const { host, port } = parseConfig();
        const baseRedisClient = createClient({ host, port });
        baseRedisClient.on('error', (err) => {
            console.error('Database error.', err);
        });
        client = initialize(baseRedisClient);
    }

    return client;
}
