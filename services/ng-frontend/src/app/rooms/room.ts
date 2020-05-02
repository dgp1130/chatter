export interface Room {
  readonly id: number;
  readonly name: string;
}

/** Serialize the given {@link Room} into a JSON-compatible representation. */
export function serialize(room: Room): SerializedRoom {
  return { ...room };
}

/**
 * Deerialize the input into a {@link Room} or throw an error if the input is not a well-formed
 * Room.
 */
export function deserialize(serialized: Probably<SerializedRoom>): Room {
  if (typeof serialized !== 'object') {
    throw new Error(`Serialized room is not an object:\n${stringify(serialized)}`);
  }
  const { id: inputId, name } = serialized as Record<string, unknown>;

  if (inputId === undefined) {
    throw new Error(`Serialized room is missing \`id\`:\n${stringify(serialized)}`);
  }
  const id = typeof inputId === 'string' ? parseInt(inputId, 10 /* radix */) : inputId;
  if (typeof id !== 'number' || isNaN(id)) {
    throw new Error(`Serialized room has non-numeric \`id\`:\n${stringify(serialized)}`);
  }

  if (name === undefined) {
    throw new Error(`Serialized room is missing \`name\`:\n${stringify(serialized)}`);
  }
  if (typeof name !== 'string') {
    throw new Error(`Serialized room has non-string \`name\`:\n${stringify(serialized)}`);
  }

  return { id, name };
}

/** Serialized representation of a Room. */
export interface SerializedRoom {
  id: number|string;
  name: string;
}

/** Pretty-print the given object to a string. */
function stringify(obj: any): string {
  return JSON.stringify(obj, null /* replacer */, 4 /* spaces per tab */);
}

// Represents an input which is expected to be type T, but comes from an unreliable source which has
// not yet been validated.
type Probably<T> = unknown;
