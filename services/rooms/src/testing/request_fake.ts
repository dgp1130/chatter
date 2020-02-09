import {Request} from 'express';

/** Fake implementation of the Express Request class. */
export default class RequestFake {
    private readonly headers: Map<string, string>;
    public readonly body: any;

    public constructor({
        headers = new Map(),
        body,
    } : {
        headers?: Map<string, string>,
        body?: Request['body'],
    } = {}) {
        this.headers = headers;
        this.body = body;
    }

    // Convenience method to cast the stub into the right Express Request type.
    public asRequest(): Request {
        return this as unknown as Request;
    }

    public get(key: string): string|undefined {
        return this.headers.get(key);
    }
}
