import { BadRequestException } from '@nestjs/common';
import { Payment } from '@entities';

export class CouldNotFindPaymentToUpdateException extends BadRequestException {
    constructor(public newPayment: Partial<Payment>, public payments: Payment[]) {
        super({
            newPayment,
            payments,
        });
    }
}
