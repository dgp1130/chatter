import * as HttpStatus from 'http-status-codes';

/** Model class representing a response to be provided to a client. */
export default class SimpleResponse {
    public readonly status: number;
    public readonly body: string;
    public readonly headers: Map<string, string>;

    public constructor({
        status = HttpStatus.OK,
        body = '',
        headers = new Map(),
    }: {
        status?: number,
        body?: string,
        headers?: Map<string, string>,
    } = {}) {
        this.status = status;
        this.body = body;

        // Default Content-Type if not explicitly set.
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'text/plain');
        }
        this.headers = headers;
    }

    get contentType(): string {
        return this.headers.get('Content-Type')!;
    }
}
