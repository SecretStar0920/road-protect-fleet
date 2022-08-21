import { HttpException } from '@nestjs/common';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class RateLimitException extends HttpException {
    constructor(message: string = ERROR_CODES.E124_RateLimitExceeded.message()) {
        super(message, 429);
        this.message = message;
    }
}
