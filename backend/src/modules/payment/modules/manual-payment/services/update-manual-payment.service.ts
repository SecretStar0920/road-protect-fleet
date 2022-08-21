import { Injectable } from '@nestjs/common';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { ManualPayment } from '@entities';
import { UpdateManualPaymentDto } from '@modules/payment/modules/manual-payment/controllers/manual-payment.controller';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';

@Injectable()
export class UpdateManualPaymentService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    async update(id: number, dto: UpdateManualPaymentDto): Promise<ManualPayment> {
        this.logger.log({ message: 'Updating Manual Payment: ', detail: merge({ id }, dto), fn: this.update.name });
        let manualPayment = await ManualPayment.findOne(id);
        manualPayment = merge(manualPayment, dto);
        await manualPayment.save();

        // Update total payments
        await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(manualPayment.infringement.infringementId);

        this.logger.log({ message: 'Updated Manual Payment: ', detail: id, fn: this.update.name });
        return manualPayment;
    }
}
