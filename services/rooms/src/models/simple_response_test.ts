import 'jasmine';

import SimpleResponse from './simple_response';
import * as HttpStatus from 'http-status-codes';

describe('SimpleResponse', () => {
    describe('constructor()', () => {
        it('constructs the SimpleResponse', () => {
            const res = new SimpleResponse({
                status: HttpStatus.OK,
                contentType: 'text/html',
                body: '<div>Hello World!</div>',
            });

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.contentType).toBe('text/html');
            expect(res.body).toBe('<div>Hello World!</div>');
        });

        it('defaults to empty response', () => {
            const res = new SimpleResponse();

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.contentType).toBe('text/plain');
            expect(res.body).toBe('');
        });
    });
});
