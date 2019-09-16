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
}

interface SerializedRoom {
    id: number;
    name: string;
}
