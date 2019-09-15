import 'jasmine';

import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import {simpleResponder} from './simple_responder';
import SimpleResponse from '../models/simple_response';
import ResponseFake from '../testing/response_fake';

describe('simple_responder', () => {
    describe('simpleResponder()', () => {
        it('returns an Express route handler which responds with the given callback\'s result',
                () => {
            const handler = jasmine.createSpy('handler').and.returnValue(new SimpleResponse({
                status: HttpStatus.OK,
                contentType: 'text/plain',
                body: 'Hello World!',
            }));
            const responder = simpleResponder(handler);

            const req = {} as Request;
            const res = new ResponseFake();
            /* no-await */ responder(req, res.asResponse()); // Should happen synchronously.

            expect(handler).toHaveBeenCalledWith(req);
            
            expect(res.statusValue).toBe(HttpStatus.OK);
            expect(res.contentTypeValue).toBe('text/plain');
            expect(res.endValue).toBe('Hello World!');
        });

        it('returns an Express route handler which responds with the given callback\'s resolved'
                + ' value when async', async () => {
            const handler = jasmine.createSpy('handler')
                    .and.returnValue(Promise.resolve(new SimpleResponse({
                status: HttpStatus.OK,
                contentType: 'text/plain',
                body: 'Hello World!',
            })));
            const responder = simpleResponder(handler);

            const req = {} as Request;
            const res = new ResponseFake();
            await responder(req, res.asResponse());

            expect(handler).toHaveBeenCalledWith(req);
            
            expect(res.statusValue).toBe(HttpStatus.OK);
            expect(res.contentTypeValue).toBe('text/plain');
            expect(res.endValue).toBe('Hello World!');
        });
    });
});
