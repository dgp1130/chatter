import 'jasmine';

import * as HttpStatus from 'http-status-codes';
import ResponseFake from './response_fake';

describe('ResponseFake', () => {
    describe('status()', () => {
        it('stores the argument in the `statusValue` field', () => {
            const res = new ResponseFake();
            res.status(HttpStatus.OK);
            expect(res.statusValue).toBe(HttpStatus.OK);
        });
    });

    describe('header()', () => {
        it('stores the argument in the `headerValues` field', () => {
            const res = new ResponseFake();
            res.header('X-Foo', 'Bar').header('X-Bar', 'Foo');
            expect(res.headerValues).toEqual(new Map([
                [ 'X-Foo', 'Bar' ],
                [ 'X-Bar', 'Foo' ],
            ]));
        });
    });
    
    describe('send()', () => {
        it('appends the argument to the `sendValues` list', () => {
            const res = new ResponseFake();
            res.send('foo');
            expect(res.sendValues).toEqual(['foo']);
        });

        it('appends each argument to the `sendValues` list when called multiple times', () => {
            const res = new ResponseFake();

            res.send('foo');
            res.send('bar');
            res.send('baz');

            expect(res.sendValues).toEqual(['foo', 'bar', 'baz']);
        });
    });
    
    describe('end()', () => {
        it('stores the argument in the `endValue` field', () => {
            const res = new ResponseFake();
            res.end('Hello World!');
            expect(res.endValue).toBe('Hello World!');
        });
    });

    describe('asResponse()', () => {
        it('returns the same object as an Express Response', () => {
            const resStub = new ResponseFake();
            const res = resStub.asResponse();
            
            res.status(HttpStatus.OK);

            expect(resStub.statusValue).toBe(HttpStatus.OK);
        });
    });
});
