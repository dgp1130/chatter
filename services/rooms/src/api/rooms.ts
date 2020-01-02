import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import SimpleResponse from '../models/simple_response';
import * as roomsDb from '../services/rooms_db_client';

/** Creates a room with the given information. */
export async function create(req: Request): Promise<SimpleResponse> {
    // Parse name from request, aborting on any input errors.
    let name: string;
    try {
        name = parseName(req.body);
    } catch (err) {
        if (err instanceof IllegalArgumentError) {
            return new SimpleResponse({
                status: HttpStatus.BAD_REQUEST,
                body: err.message,
            });
        } else {
            throw err;
        }
    }

    // Create the room in backend database.
    const room = await roomsDb.create(name);

    // Respond with new Room as JSON.
    return new SimpleResponse({
        status: HttpStatus.CREATED,
        contentType: 'application/json',
        body: JSON.stringify(room.serialize(), null /* replacer */, 4 /* tabSize */),
    });
}

/** Lists all available rooms. */
export async function list(): Promise<SimpleResponse> {
    // Read all rooms in the backend database.
    const rooms = await roomsDb.list();

    return new SimpleResponse({
        status: HttpStatus.OK,
        contentType: 'application/json',
        body: JSON.stringify(
            rooms.map((room) => room.serialize()),
            null /* replacer */,
            4 /* spaces per tab */,
        ),
    });
}

// Safely parses the "name" field out of unsanitized JSON.
function parseName(json: unknown): string {
    if (!json) throw new IllegalArgumentError('Must provide a JSON body in the request.');
    if (typeof json !== 'object') {
        throw new IllegalArgumentError('Request body must be a JSON object.');
    }
    
    const jsonObj = json as Record<string, unknown>;
    const name = jsonObj['name'] as unknown;
    if (name === undefined) throw new IllegalArgumentError('Must provide a "name" field.');
    if (typeof name !== 'string') {
        throw new IllegalArgumentError('Must provide the "name" field as a string.');
    }

    return name as string;
}

class IllegalArgumentError extends Error {
    constructor(...args: Parameters<ErrorConstructor>) {
        super(...args);
    }
}
