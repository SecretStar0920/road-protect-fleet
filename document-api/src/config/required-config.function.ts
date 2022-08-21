export function requiredConfig(configName: string) {
    throw new Error(`Required ${configName} is not set`);
    return '';
}
