import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Payment } from '@entities';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeletePaymentService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<Payment> {
        this.logger.log({ message: 'Deleting Payment:', detail: id, fn: this.delete.name });
        const payment = await Payment.findOne(id);
        this.logger.log({ message: 'Found Payment:', detail: id, fn: this.delete.name });
        if (!payment) {
            this.logger.warn({ message: 'Could not find Payment to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E146_CouldNotFindPaymentToDelete.message() });
        }

        await Payment.remove(payment);
        this.logger.log({ message: 'Deleted Payment:', detail: id, fn: this.delete.name });
        const newPayment = Payment.create({ paymentId: id });

        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(payment.infringement.infringementId);

        return newPayment;
    }

    async softDelete(id: number): Promise<Payment> {
        this.logger.log({ message: 'Soft Deleting Payment:', detail: id, fn: this.delete.name });
        const payment = await Payment.findOne(id);
        this.logger.log({ message: 'Found Payment:', detail: id, fn: this.delete.name });
        if (!payment) {
            this.logger.warn({ message: 'Could not find Payment to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E146_CouldNotFindPaymentToDelete.message() });
        }

        // payment.active = false; // FIXME
        await payment.save();

        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(payment.infringement.infringementId);

        this.logger.log({ message: 'Soft Deleted Payment:', detail: id, fn: this.delete.name });
        return payment;
    }
}
