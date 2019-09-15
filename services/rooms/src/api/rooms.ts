import {Request, Response} from 'express';
import * as HttpStatus from 'http-status-codes';
import Room from '../models/room';
import SimpleResponse from '../models/simple_response';

/** Container of local state related to the Rooms API. */
export default class RoomsApi {
    /**
     * The ID to use for the next room, stored statically to apply across all
     * requests. This is temporary until rooms are stored in a proper database.
     */
    private nextRoomId: number = 0;

    /** Creates a room with the given information. */
    public create(req: Request): SimpleResponse {
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

        // Create a new Room with a clean ID and the given name.
        const id = this.nextRoomId++;
        const room = new Room({id, name});
        
        // Respond with new Room as JSON.
        return new SimpleResponse({
            status: HttpStatus.OK,
            contentType: 'application/json',
            body: room.stringify(),
        });
    }
}

// Safely parses the "name" field out of unsanitized JSON.
function parseName(json: unknown): string {
    if (!json) throw new IllegalArgumentError('Must provide a JSON body in the request.');
    
    const name = json['name'] as unknown;
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
