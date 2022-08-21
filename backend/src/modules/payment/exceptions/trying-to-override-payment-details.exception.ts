import { BadRequestException } from '@nestjs/common';
import { Payment } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class TryingToOverridePaymentDetailsException extends BadRequestException {
    constructor(public previous: Partial<Payment>, public next: Partial<Payment>) {
        super({
            message: ERROR_CODES.E128_TryingToOverridePaymentDetailsException.message(),
            previous,
            next,
        });
    }
}
