/**
 * In some cases, the tests end before our logs have time to print out. Add an
 * await on this function and you should see the logs. Note that this is for
 * debugging purposes.
 */
export async function waitForLogs(ms: number = 300) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
