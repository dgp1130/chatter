/**
 * Represents a callback which provides a function to be invoked as well as a Promise to await on.
 * 
 * Usage:
 * ```typescript
 * const cb = new Callback();
 * 
 * // Invoke the callback function some time in the future.
 * setTimeout(() => {
 *   const func = cb.asFunction();
 *   func(1, 2, 3);
 * }, 1000);
 * 
 * // Wait for the function to invoked and read its arguments.
 * const args = await func.asPromise();
 * expect(args).toEqual([1, 2, 3]);
 * ```
 */
export default class Callback {
    private resolvers: Array<(args: unknown[]) => void> = [];

    public asFunction(): (...args: unknown[]) => void {
        return (...args: unknown[]) => {
            for (const resolver of this.resolvers) {
                resolver(args);
            }
        };
    }

    public asPromise(): Promise<unknown[]> {
        const promise = new Promise<unknown[]>((resolver) => {
            this.resolvers.push(resolver);
        });
        return promise;
    }
}