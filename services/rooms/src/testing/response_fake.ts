import {Response} from 'express';

/** Fake implementation of the Express Response class. */
export default class ResponseFake {
    // Convenience method to cast the stub into the right Express Response type.
    public asResponse(): Response {
        return this as unknown as Response;
    }

    public statusValue?: number;
    public status(status: number): this {
        this.statusValue = status;
        return this;
    }

    public contentTypeValue?: string;
    public contentType(contentType: string): this {
        this.contentTypeValue = contentType;
        return this;
    }

    // send() can be called multiple times, so each one should be tracked separately.
    public sendValues: string[] = [];
    public send(body: string): this {
        this.sendValues.push(body);
        return this;
    }

    public endValue?: string;
    public end(body: string): this {
        this.endValue = body;
        return this;
    }
}
