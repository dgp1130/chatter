import RequestFake from './request_fake';

describe('RequestFake', () => {
    it('stubs headers', () => {
        const req = new RequestFake({
            headers: new Map([
                [ 'Content-Type', 'application/json' ],
                [ 'X-Foo', 'Bar' ],
            ]),
        });

        expect(req.get('Content-Type')).toBe('application/json');
        expect(req.get('X-Foo')).toBe('Bar');
        expect(req.get('X-Sir-Not-Appearing-In-This-Film')).toBeUndefined();
    });

    it('stubs body', () => {
        const req = new RequestFake({
            body: 'some body',
        });

        expect(req.body).toBe('some body');
    });

    it('defaults to empty data', () => {
        const req = new RequestFake();

        expect(req.get('Content-Type')).toBeUndefined(); // All headers should be `undefined`.
        expect(req.body).toBeUndefined();
    });
});