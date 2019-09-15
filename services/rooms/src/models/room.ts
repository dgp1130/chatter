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

    /** Serializes this Room to JSON. */
    public stringify(): string {
        return JSON.stringify({
            id: this.id,
            name: this.name,
        }, null /* replacer */, 4 /* spaces per tab */);
    }
}
