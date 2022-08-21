export function isNumberString(str: string): boolean {
    return /^[0-9]+$/.test(str.toString());
}
