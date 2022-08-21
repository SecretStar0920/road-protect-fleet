export function safeParse<T = any>(data: any, defaultReturn: T = undefined): T {
    try {
        return JSON.parse(data);
    } catch (e) {
        return defaultReturn;
    }
}
