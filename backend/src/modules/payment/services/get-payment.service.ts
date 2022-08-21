import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Payment } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetPaymentService {
    constructor(private logger: Logger) {}

    async get(paymentId: number): Promise<Payment> {
        this.logger.log({ message: `Getting Payment with id: `, detail: paymentId, fn: this.get.name });
        const payment = await Payment.createQueryBuilder('payment').andWhere('payment.paymentId = :id', { id: paymentId }).getOne();
        if (!payment) {
            throw new BadRequestException({ message: ERROR_CODES.E147_CouldNotFindPayment.message({ paymentId }) });
        }
        this.logger.log({ message: `Found Payment with id: `, detail: payment.paymentId, fn: this.get.name });
        return payment;
    }

    async getAll(): Promise<Payment[]> {
        this.logger.log({ message: `Getting Payments`, detail: null, fn: this.get.name });
        const payments = await Payment.createQueryBuilder('payment').getMany();
        this.logger.log({ message: `Found Payments, length: `, detail: payments.length, fn: this.get.name });
        return payments;
    }

    async getForInfringement(infringementId: number) {
        return Payment.createQueryBuilder('payment').where('payment."infringementId" = :infringementId', { infringementId }).getMany();
    }
}
