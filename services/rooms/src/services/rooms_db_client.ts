import Room from '../models/room';
import * as dbClient from './db_client';

const SECS_PER_MIN = 60;
const SECS_PER_HOUR = 60 * SECS_PER_MIN;
const SECS_PER_DAY = 24 * SECS_PER_HOUR;

const ROOM_EXPIRY_SEC = 1 * SECS_PER_DAY;

/** Creates a room with the given name in the database and returns it. */
export async function create(name: string): Promise<Room> {
    // Create a new Room with an unused ID and the given name.
    const client = dbClient.getClient();
    const id = await client.incr('rooms.currId');
    const room = new Room({ id, name });
    const serialized = room.serialize();

    // Add the new room to the database.
    interface Stringable {
        toString(): string;
    }
    await dbClient.execMulti(client.multi()
        .zadd('rooms.byCreationTimestamp', Date.now() /* score */, id.toString() /* value */)
        .hmset(
            `rooms.byId.${id}` /* key */,
            ...Object.entries(serialized) // Key/value pairs.
                .reduce((l, r) => [...l, ...r], [] as Stringable[])
                .map((value) => value.toString()),
        )
        .expire(`rooms.byId.${id}`, ROOM_EXPIRY_SEC),
    );

    return room;
}

/** Returns all rooms currently available in the database. */
export async function list(): Promise<Room[]> {
    // Find all room IDs which are still active.
    const client = dbClient.getClient();
    const nowSec = Date.now() / 1_000;
    const roomIds = await client.zRangeByScore(
        'rooms.byCreationTimestamp' /* key */,
        nowSec - ROOM_EXPIRY_SEC /* start time */,
        '+inf' /* end time */,
    );

    // Look up all active rooms in database.
    const serializedRoomData = await Promise.all(
        roomIds.map((roomId) => client.hGetAll(`rooms.byId.${roomId}`).then((room) => ({
            resolved: true,
            result: room,
        }), (err) => {
            console.error(`Failed to read Room ${roomId} from database.`, err);
            return {
                resolved: false,
                result: undefined,
            } as const;
        })),
    );
    const serializedRooms = serializedRoomData
        .flatMap((data) => data.resolved ? [data.result] : []);

    // Parse database response data into in-memory Room objects.
    return serializedRooms.flatMap((serialized) => {
        try {
            return [ Room.deserialize(serialized) ];
        } catch (err) {
            console.error(`Failed to deserialize Room read from database:\n${
                JSON.stringify(serialized, null /* replacer */, 4 /* tabSize */)}`, err);
            return [];
        }
    });
}
