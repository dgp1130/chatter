import 'jasmine';

import Callback from './callback';

describe('Callback', () => {
    it('resolves the Promise with the arguments provided to the callback', async () => {
        const cb = new Callback();

        setTimeout(() => {
            const func = cb.asFunction();
            func(1, 2, 3);
        }, 1);

        const args = await cb.asPromise();
        expect(args).toEqual([1, 2, 3]);
    });

    it('resolves all Promises with the arguments provided to the callback', async () => {
        const cb = new Callback();

        setTimeout(() => {
            const func = cb.asFunction();
            func(1, 2, 3);
        }, 1);

        const [args1, args2, args3] = await Promise.all([
            cb.asPromise(),
            cb.asPromise(),
            cb.asPromise(),
        ]);

        expect(args1).toEqual([1, 2, 3]);
        expect(args2).toEqual([1, 2, 3]);
        expect(args3).toEqual([1, 2, 3]);
    });
});