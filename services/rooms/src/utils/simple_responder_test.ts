import 'jasmine';

import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {simpleResponder} from './simple_responder';
import SimpleResponse from '../models/simple_response';
import ResponseFake from '../testing/response_fake';
import Callback from '../testing/callback';

describe('simple_responder', () => {
    describe('simpleResponder()', () => {
        it('returns an Express route handler which responds with the given callback\'s result',
                async () => {
            const handler = jasmine.createSpy('handler').and.returnValue(new SimpleResponse({
                status: HttpStatus.OK,
                body: 'Hello World!',
                headers: new Map([
                    [ 'Content-Type', 'text/plain' ],
                ]),
            }));
            const responder = simpleResponder(handler);

            const req = {} as Request;
            const res = new ResponseFake();
            const next = new Callback();
            responder(req, res.asResponse(), next.asFunction());
            const [err, ..._] = await next.asPromise();

            expect(handler).toHaveBeenCalledWith(req);
            expect(err).toBeUndefined();
            
            expect(res.statusValue).toBe(HttpStatus.OK);
            expect(res.headerValues).toEqual(new Map([
                [ 'Content-Type', 'text/plain' ],
            ]));
            expect(res.endValue).toBe('Hello World!');
        });

        it('returns an Express route handler which responds with the given callback\'s resolved'
                + ' value when async', async () => {
            const handler = jasmine.createSpy('handler')
                    .and.returnValue(Promise.resolve(new SimpleResponse({
                status: HttpStatus.OK,
                body: 'Hello World!',
                headers: new Map([
                    [ 'Content-Type', 'text/plain' ],
                ]),
            })));
            const responder = simpleResponder(handler);

            const req = {} as Request;
            const res = new ResponseFake();
            const next = new Callback();
            responder(req, res.asResponse(), next.asFunction());
            const [err, ..._] = await next.asPromise();

            expect(handler).toHaveBeenCalledWith(req);
            expect(err).toBeUndefined();
            
            expect(res.statusValue).toBe(HttpStatus.OK);
            expect(res.headerValues).toEqual(new Map([
                [ 'Content-Type', 'text/plain' ],
            ]));
            expect(res.endValue).toBe('Hello World!');
        });

        it('invokes `next()` with error when one is thrown', async () => {
            const handler = jasmine.createSpy('handler').and.throwError('Uh oh, sphagettiohs!');
            const responder = simpleResponder(handler);

            const req = {} as Request;
            const res = new ResponseFake();
            const next = new Callback();
            responder(req, res.asResponse(), next.asFunction());
            const [err, ..._] = await next.asPromise();

            expect(handler).toHaveBeenCalledWith(req);
            expect(err instanceof Error).toBe(true);
        });

        it('invokes `next()` with error when one is rejected', async () => {
            const error = new Error('Uh oh, sphagettiohs!');
            const handler = jasmine.createSpy('handler')
                .and.returnValue(Promise.reject(error));
            const responder = simpleResponder(handler);

            const req = {} as Request;
            const res = new ResponseFake();
            const next = new Callback();
            responder(req, res.asResponse(), next.asFunction());
            const [err, ..._] = await next.asPromise();

            expect(handler).toHaveBeenCalledWith(req);
            expect(err).toBe(error);
        });
    });
});
