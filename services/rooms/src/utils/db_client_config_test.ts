import { parseConfig } from "./db_client_config";

const VALID_ENV = {
    'CHATTER_DB_SERVICE_SERVICE_HOST': 'db.svc.local',
    'CHATTER_DB_SERVICE_SERVICE_PORT': '1234',
};

describe('db_client_config', () => {
    describe('parseConfig()', () => {
        it('returns a database config parsed from environment variables', () => {
            process.env = VALID_ENV;

            const { host, port } = parseConfig();

            expect(host).toBe('db.svc.local');
            expect(port).toBe(1234);
        });

        it('throws an error when no hostname is given', () => {
            process.env = {
                ...VALID_ENV,
                'CHATTER_DB_SERVICE_SERVICE_HOST': undefined,
            };

            expect(() => parseConfig())
                .toThrowMatching((err) => err.message.includes('CHATTER_DB_SERVICE_SERVICE_HOST'));
        });

        it('returns undefined port when not present in environment', () => {
            process.env = {
                ...VALID_ENV,
                'CHATTER_DB_SERVICE_SERVICE_PORT': undefined,
            };

            const { port } = parseConfig();

            expect(port).toBeUndefined();
        });

        it('throws an error when a non-numeric port is given', () => {
            process.env = {
                ...VALID_ENV,
                'CHATTER_DB_SERVICE_SERVICE_PORT': 'hello', // Not a number.
            };

            expect(() => parseConfig())
                .toThrowMatching((err) => err.message.includes('CHATTER_DB_SERVICE_SERVICE_PORT'));
        });
    });
});
