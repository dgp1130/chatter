import * as HttpStatus from 'http-status-codes';

/** Model class representing a response to be provided to a client. */
export default class SimpleResponse {
    public readonly status: number;
    public readonly contentType: string;
    public readonly body: string;

    public constructor({
        status = HttpStatus.OK,
        contentType = 'text/plain',
        body = '',
    }: {
        status?: number,
        contentType?: string,
        body?: string,
    } = {}) {
        this.status = status;
        this.contentType = contentType;
        this.body = body;
    }
}
