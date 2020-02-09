import {Request, Response, NextFunction} from 'express';
import SimpleResponse from '../models/simple_response';

/**
 * A higher-order function which returns a response rather than edits a {@link Response} parameter.
 * This is useful for testing the handler function, because the result can simply be asserted rather
 * than spying on methods attached to the {@link Response} object provided by parameter.
 * 
 * Usage:
 * ```typescript
 * import * as express from 'express';
 * const app = express();
 * 
 * app.get('/', simpleResponder((req: Request) => {
 *   return new SimpleResponse({
 *     status: 200, // HTTP OK
 *     contentType: 'text/html',
 *     body: '<div>Hello World!</div>',
 *   });
 * }));
 * ```
 * 
 * The handler callback can also be an async function returning a {@link Promise<SimpleResponse>}.
 * 
 * @param handler Function which implements the Express API route, returning a {@link
 *     SimpleResponse} object (or a {@link Promise<SimpleResponse>}) to respond to the client with.
 * @returns Express route handler.
 */
export function simpleResponder(handler: (req: Request) => SimpleResponse|Promise<SimpleResponse>)
        :(req: Request, res: Response, next: NextFunction) => void {
    return asyncHandler(async (req: Request, res: Response) => {
        const simpleResponseOrPromise = handler(req);
        const simpleResponse = simpleResponseOrPromise instanceof Promise
            ? await simpleResponseOrPromise
            : simpleResponseOrPromise;

        res.status(simpleResponse.status);
        for (const [key, value] of simpleResponse.headers) {
            res.header(key, value);
        }
        res.end(simpleResponse.body);
    });
}

// Provides an Express handler which awaits the given async handler and propagates the result/errors
// correctly to Express.
function asyncHandler(handler: (req: Request, res: Response) => Promise<void>)
        : (req: Request, res: Response, next: NextFunction) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res);
        } catch (err) {
            next(err);
            return;
        }
        next();
    };
}
