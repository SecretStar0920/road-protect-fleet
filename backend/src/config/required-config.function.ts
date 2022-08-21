import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export function requiredConfig(configName: string) {
    throw new Error(ERROR_CODES.E133_EnvVariableNotSet.message({ configName }));
    return null;
}
