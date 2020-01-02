import 'jasmine';

import Room from './room';

describe('Room', () => {
    describe('constructor()', () => {
        it('constructs a Room', () => {
            const room = new Room({
                id: 5,
                name: 'foo',
            });

            expect(room.id).toBe(5);
            expect(room.name).toBe('foo');
        });
    });

    describe('serialize()', () => {
        it('returns the Room as a basic object', () => {
            const room = new Room({
                id: 5,
                name: 'foo',
            });

            const serialized = room.serialize();

            expect(serialized).toEqual({
                id: 5,
                name: 'foo',
            });
        });
    });

    describe('deserialize()', () => {
        it('parses a Room out of a valid serialized object', () => {
            const room = Room.deserialize({
                id: 5,
                name: 'foo',
            });

            expect(room).toEqual(new Room({
                id: 5,
                name: 'foo',
            }));
        });

        it('parses a Room with a stringified ID', () => {
            const room = Room.deserialize({
                id: '5',
                name: 'foo',
            });

            expect(room).toEqual(new Room({
                id: 5,
                name: 'foo',
            }));
        });

        const SERIALIZED = {
            id: 5,
            name: 'foo',
        };

        it('throws an error when given a serialized object without an ID', () => {
            expect(() => Room.deserialize({
                ...SERIALIZED,
                id: undefined,
            })).toThrow();
        });

        it('throws an error when given a serialized object with a non-numeric ID', () => {
            expect(() => Room.deserialize({
                ...SERIALIZED,
                id: 'test',
            })).toThrow();
        });

        it('throws an error when given a serialized object without a name', () => {
            expect(() => Room.deserialize({
                ...SERIALIZED,
                name: undefined,
            })).toThrow();
        });
    });
});
