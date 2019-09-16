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
});
