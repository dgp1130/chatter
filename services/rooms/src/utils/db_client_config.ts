/** Returns the global configuration for the backend database client. */
export function parseConfig(): { host: string, port?: number } {
    // Load required database host from environment.
    const host = process.env['CHATTER_DB_SERVICE_SERVICE_HOST'];
    if (!host) {
        throw new Error('Database host env missing: CHATTER_DB_SERVICE_SERVICE_HOST');
    }

    // Load optional database port from environment.
    const portEnv = process.env['CHATTER_DB_SERVICE_SERVICE_PORT'];
    const portNumber = portEnv ? parseInt(portEnv) : undefined;
    if (typeof portNumber === 'number' && isNaN(portNumber)) {
        throw new Error(`Database port env is not a number: CHATTER_DB_SERVICE_SERVICE_PORT (${portEnv})`);
    }
    const port = portEnv ? portNumber : undefined;

    return { host, port };
}
