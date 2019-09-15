import 'jasmine';

import {Request} from 'express';
import RoomsApi from './rooms';
import * as HttpStatus from 'http-status-codes';

describe('rooms', () => {
    describe('create()', () => {
        it('responds HTTP OK with the new Room', () => {
            const rooms = new RoomsApi();
            const res = rooms.create({
                body: {
                    name: 'foo',
                },
            } as Request);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.contentType).toBe('application/json');
            expect(JSON.parse(res.body)).toEqual({
                id: 0,
                name: 'foo',
            });
        });

        it('responds HTTP Bad Request when no body is given', () => {
            const rooms = new RoomsApi();
            const res = rooms.create({} as Request);

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when body is not a JSON object', () => {
            const rooms = new RoomsApi();
            const res = rooms.create({
                body: 'test',
            } as Request);

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when not given a "name" field', () => {
            const rooms = new RoomsApi();
            const res = rooms.create({
                body: {
                    foo: 'bar',
                },
            } as Request);

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when not given a string "name" field', () => {
            const rooms = new RoomsApi();

            const booleanRes = rooms.create({
                body: {
                    name: true,
                },
            } as Request);
            expect(booleanRes.status).toBe(HttpStatus.BAD_REQUEST);
            
            const numberRes = rooms.create({
                body: {
                    name: 5,
                },
            } as Request);
            expect(numberRes.status).toBe(HttpStatus.BAD_REQUEST);
            
            const nullRes = rooms.create({
                body: {
                    name: null,
                },
            } as Request);
            expect(nullRes.status).toBe(HttpStatus.BAD_REQUEST);

            const objRes = rooms.create({
                body: {
                    name: {
                        foo: 'bar',
                    },
                },
            } as Request);
            expect(objRes.status).toBe(HttpStatus.BAD_REQUEST);

            const listRes = rooms.create({
                body: {
                    name: ['foo', 'bar', 'baz'],
                },
            } as Request);
            expect(listRes.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('increments the generated ID on each call', () => {
            const rooms = new RoomsApi();

            const req1 = {
                body: {
                    name: 'foo',
                },
            } as Request;
            const res1 = rooms.create(req1);

            expect(res1.status).toBe(HttpStatus.OK);
            expect(res1.contentType).toBe('application/json');
            expect(JSON.parse(res1.body)).toEqual({
                id: 0,
                name: 'foo',
            });

            const req2 = {
                body: {
                    name: 'bar',
                },
            } as Request;
            const res2 = rooms.create(req2);

            expect(res2.status).toBe(HttpStatus.OK);
            expect(res2.contentType).toBe('application/json');
            expect(JSON.parse(res2.body)).toEqual({
                id: 1,
                name: 'bar',
            });
        });
    });
});