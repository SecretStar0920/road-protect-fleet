/**
 * Adds a timeout to a promise and resolves (or rejects) whichever comes first.
 * Check:
 * https://italonascimento.github.io/applying-a-timeout-to-your-promises/
 * @param promise The promise we want to run
 * @param timeoutMs The timeout in milliseconds
 */
export async function promiseTimeout<T>(promise: Promise<T>, timeoutMs: number) {
    const timeout = new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + timeoutMs + 'ms.');
        }, timeoutMs);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
}
