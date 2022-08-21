import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class IssuerDoesNotExistForManualRedirectionException extends Error {
    constructor(issuer: string) {
        super(ERROR_CODES.E121_IssuerDoesNotExistForManualRedirection.message({ issuer }));
    }
}
