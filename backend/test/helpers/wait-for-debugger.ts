/**
 * In some cases, the tests end before our logs have time to print out. Add an
 * await on this function and you should see the logs. Note that this is for
 * debugging purposes.
 */
jest.setTimeout(3000000);
export async function waitForDebugger(ms: number = 10000) {
    console.log('Hit the debugger now!');
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, ms),
    );
}
