import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ManualPayment } from '@entities';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteManualPaymentService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    /**
     * Hard delete
     */
    async delete(id: number): Promise<ManualPayment> {
        this.logger.log({ message: 'Deleting Manual Payment:', detail: id, fn: this.delete.name });
        const manualPayment = await ManualPayment.findOne(id);
        this.logger.log({ message: 'Found Manual Payment:', detail: id, fn: this.delete.name });
        if (!manualPayment) {
            this.logger.warn({ message: 'Could not find Manual Payment to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E144_CouldNotFindManualPaymentToDelete.message() });
        }

        await ManualPayment.remove(manualPayment);
        this.logger.log({ message: 'Deleted Manual Payment:', detail: id, fn: this.delete.name });

        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(manualPayment.infringement.infringementId);
        return ManualPayment.create({ paymentId: id });
    }

    async softDelete(id: number): Promise<ManualPayment> {
        this.logger.log({ message: 'Soft Deleting Manual Payment:', detail: id, fn: this.delete.name });
        const manualPayment = await ManualPayment.findOne(id);
        this.logger.log({ message: 'Found Manual Payment:', detail: id, fn: this.delete.name });
        if (!manualPayment) {
            this.logger.warn({ message: 'Could not find Manual Payment to delete', detail: id, fn: this.delete.name });
            throw new BadRequestException({ message: ERROR_CODES.E144_CouldNotFindManualPaymentToDelete.message() });
        }

        // manualPayment.active = false; // FIXME
        await manualPayment.save();
        this.logger.log({ message: 'Soft Deleted Manual Payment:', detail: id, fn: this.delete.name });
        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(manualPayment.infringement.infringementId);
        return manualPayment;
    }
}
