import 'jasmine';

import SimpleResponse from './simple_response';
import * as HttpStatus from 'http-status-codes';

describe('SimpleResponse', () => {
    describe('constructor()', () => {
        it('constructs the SimpleResponse', () => {
            const res = new SimpleResponse({
                status: HttpStatus.OK,
                body: '<div>Hello World!</div>',
                headers: new Map([
                    [ 'Content-Type', 'text/html' ],
                    [ 'X-Foo', 'Bar' ],
                ]),
            });

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBe('<div>Hello World!</div>');
            expect(res.headers).toEqual(new Map([
                [ 'Content-Type', 'text/html' ],
                [ 'X-Foo', 'Bar' ],
            ]))
            expect(res.contentType).toBe('text/html');
        });

        it('defaults to empty response', () => {
            const res = new SimpleResponse();

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBe('');
            expect(res.headers).toEqual(new Map([
                [ 'Content-Type', 'text/plain' ],
            ]));
            expect(res.contentType).toBe('text/plain');
        });
    });
});
