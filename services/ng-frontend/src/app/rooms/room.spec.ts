import { serialize, deserialize, Room, SerializedRoom } from './room';

describe('Room', () => {
  describe('serialize()', () => {
    it('serializes to a simple object', () => {
      const room: Room = {
        id: 1234,
        name: 'test',
      };

      expect(serialize(room)).toEqual({
        id: 1234,
        name: 'test',
      });
    });
  });

  describe('deserialize()', () => {
    const GOLDEN_SERIALIZED: SerializedRoom = Object.freeze({
      id: 1234,
      name: 'test',
    });

    it('deserializes a Room with a numeric ID', () => {
      const room = deserialize({
        id: 1234,
        name: 'test',
      });

      expect(room).toEqual({
        id: 1234,
        name: 'test',
      });
    });

    it('deserializes a Room with a string ID', () => {
      const room = deserialize({
        id: '1234',
        name: 'test',
      });

      expect(room).toEqual({
        id: 1234,
        name: 'test',
      });
    });

    it('throws an error when given a non-object', () => {
      const expectedErr = 'not an object';

      expect(() => deserialize('test'))
          .toThrowMatching((err: Error) => err.message.includes(expectedErr));
      expect(() => deserialize(true))
          .toThrowMatching((err: Error) => err.message.includes(expectedErr));
      expect(() => deserialize(1234))
          .toThrowMatching((err: Error) => err.message.includes(expectedErr));
    });

    it('throws an error when missing an ID', () => {
      expect(() => deserialize({
        ...GOLDEN_SERIALIZED,
        id: undefined,
      })).toThrowMatching((err: Error) => err.message.includes('missing `id`'));
    });

    it('throws an error when given non-numeric/unparseable ID', () => {
      const expectedErr = 'non-numeric `id`';

      expect(() => deserialize({
        ...GOLDEN_SERIALIZED,
        id: true, // Not a number.
      })).toThrowMatching((err: Error) => err.message.includes(expectedErr));

      expect(() => deserialize({
        ...GOLDEN_SERIALIZED,
        id: 'test', // Not a parseable string.
      })).toThrowMatching((err: Error) => err.message.includes(expectedErr));
    });

    it('throws an error when given missing a name', () => {
      expect(() => deserialize({
        ...GOLDEN_SERIALIZED,
        name: undefined,
      })).toThrowMatching((err: Error) => err.message.includes('missing `name`'));
    });

    it('throws an error when given a non-string name', () => {
      const expectedErr = 'non-string `name`';

      expect(() => deserialize({
        ...GOLDEN_SERIALIZED,
        name: true,
      })).toThrowMatching((err: Error) => err.message.includes(expectedErr));

      expect(() => deserialize({
        ...GOLDEN_SERIALIZED,
        name: 1234,
      })).toThrowMatching((err: Error) => err.message.includes(expectedErr));
    });
  });
});
