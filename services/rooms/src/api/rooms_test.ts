import 'jasmine';

import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as rooms from './rooms';
import * as roomsDb from '../services/rooms_db_client';
import RequestFake from '../testing/request_fake';
import Room from '../models/room';

describe('rooms', () => {
    describe('create()', () => {
        it('responds HTTP Created with the new Room', async () => {
            spyOn(roomsDb, 'create').and.returnValue(Promise.resolve(new Room({
                id: 0,
                name: 'foo',
            })));

            const res = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    name: 'foo',
                },
            }).asRequest());

            expect(roomsDb.create).toHaveBeenCalledWith('foo');

            expect(res.status).toBe(HttpStatus.CREATED);
            expect(res.headers).toEqual(new Map([
                [ 'Content-Type', 'application/json' ],
                [ 'Access-Control-Allow-Origin', '*' ],
            ]));
            expect(JSON.parse(res.body)).toEqual({
                id: 0,
                name: 'foo',
            });
        });

        it('responds HTTP Bad Request with specific error when not given JSON Content-Type',
                async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/x-www-form-urlencoded' ], // Not application/json.
                ]),
            }).asRequest());

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            expect(res.body).toBe('Request Content-Type (application/x-www-form-urlencoded) *must*'
                    + ' be set to "application/json".');
        });

        it('responds HTTP Bad Request when no body is given', async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
            }).asRequest());

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when body is not a JSON object', async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: 'test',
            }).asRequest());

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when not given a "name" field', async () => {
            spyOn(roomsDb, 'create');

            const res = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    foo: 'bar',
                },
            }).asRequest());

            expect(roomsDb.create).not.toHaveBeenCalled();

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('responds HTTP Bad Request when not given a string "name" field', async () => {
            spyOn(roomsDb, 'create');

            const booleanRes = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    name: true,
                },
            }).asRequest());
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(booleanRes.status).toBe(HttpStatus.BAD_REQUEST);
            
            const numberRes = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    name: 5,
                },
            }).asRequest());
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(numberRes.status).toBe(HttpStatus.BAD_REQUEST);
            
            const nullRes = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    name: null,
                },
            }).asRequest());
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(nullRes.status).toBe(HttpStatus.BAD_REQUEST);

            const objRes = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    name: {
                        foo: 'bar',
                    },
                },
            }).asRequest());
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(objRes.status).toBe(HttpStatus.BAD_REQUEST);

            const listRes = await rooms.create(new RequestFake({
                headers: new Map([
                    [ 'Content-Type', 'application/json' ],
                ]),
                body: {
                    name: ['foo', 'bar', 'baz'],
                },
            }).asRequest());
            expect(roomsDb.create).not.toHaveBeenCalled();
            expect(listRes.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });

    describe('list()', () => {
        it('responds HTTP OK with an empty list when no rooms exist', async () => {
            spyOn(roomsDb, 'list').and.returnValue(Promise.resolve([]));

            const res = await rooms.list();

            expect(roomsDb.list).toHaveBeenCalledWith(/* nothing */);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.headers).toEqual(new Map([
                [ 'Content-Type', 'application/json' ],
                [ 'Access-Control-Allow-Origin', '*' ],
            ]));
            expect(JSON.parse(res.body)).toEqual([]);
        });

        it('responds HTTP OK with all the currently available rooms', async () => {
            spyOn(roomsDb, 'list').and.returnValue(Promise.resolve([
                new Room({ id: 0, name: 'foo' }),
                new Room({ id: 1, name: 'bar' }),
            ]));

            const res = await rooms.list();

            expect(roomsDb.list).toHaveBeenCalledWith(/* nothing */);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.headers).toEqual(new Map([
                [ 'Content-Type', 'application/json' ],
                [ 'Access-Control-Allow-Origin', '*' ],
            ]));
            expect(JSON.parse(res.body)).toEqual([{
                id: 0,
                name: 'foo',
            }, {
                id: 1,
                name: 'bar',
            }]);
        });
    });
});
