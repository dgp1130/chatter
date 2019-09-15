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

    describe('stringify()', () => {
        it('returns the Room as JSON', () => {
            const room = new Room({
                id: 5,
                name: 'foo',
            });

            const json = room.stringify();

            expect(JSON.parse(json)).toEqual({
                id: 5,
                name: 'foo',
            });
        });
    });
});
