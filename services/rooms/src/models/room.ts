/** Immutable model class representing a Room. */
export default class Room {
    public readonly id: number;
    public readonly name: string;

    constructor({id, name}: {
        readonly id: number,
        readonly name: string,
    }) {
        this.id = id;
        this.name = name;
    }

    /** Serializes this Room to a raw JavaScript object. */
    public serialize(): SerializedRoom {
        return {
            id: this.id,
            name: this.name,
        };
    }

    /** Deserialize a Room object from a raw JavaScript object. */
    public static deserialize(serialized: Partial<SerializedRoom>): Room {
        const { id: inputId, name } = serialized;
        
        if (inputId === undefined) throw new Error(`Serialized room is missing \`id\`:\n${stringify(serialized)}`);
        const id = typeof inputId === 'string' ? parseInt(inputId) : inputId;
        if (isNaN(id)) throw new Error(`Serialized room has non-numeric \`id\`:\n${stringify(serialized)}`);

        if (name === undefined) throw new Error(`Serialized room is missing \`name\`:\n${stringify(serialized)}`);

        return new Room({ id, name });
    }
}

function stringify(obj: any): string {
    return JSON.stringify(obj, null /* replacer */, 4 /* spaces per tab */);
}

interface SerializedRoom {
    id: number|string;
    name: string;
}
