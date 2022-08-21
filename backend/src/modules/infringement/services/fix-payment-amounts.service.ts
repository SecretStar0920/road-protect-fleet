import { Injectable } from '@nestjs/common';
import { Infringement } from '@entities';
import { Logger } from '@logger';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { UpdateInfringementPenaltyAmountService } from '@modules/infringement/services/update-infringement-penalty-amount.service';

@Injectable()
export class FixPaymentAmountsService {
    constructor(
        private logger: Logger,
        private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService,
        private updateInfringementPenaltyAmountService: UpdateInfringementPenaltyAmountService,
    ) {}

    async fix() {
        // Find all infringements where total payments is NAN
        const infringements: Infringement[] = await Infringement.findWithMinimalRelations()
            .andWhere(`infringement.totalPayments = 'NaN'`)
            .getMany();

        this.logger.debug({ message: `Found ${infringements.length} infringements with NaN`, fn: this.fix.name });

        const changes: Partial<Infringement>[] = [];
        for (const infringement of infringements) {
            await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(infringement.infringementId);
            infringement.penaltyAmount = await this.updateInfringementPenaltyAmountService.updatePenaltyAmount(infringement);
            await infringement.save();
            changes.push({
                infringementId: infringement.infringementId,
                penaltyAmount: infringement.penaltyAmount,
                totalPayments: infringement.totalPayments,
                amountDue: infringement.amountDue,
                originalAmount: infringement.originalAmount,
                payments: infringement.payments,
            });
        }
        return changes;
    }
}
