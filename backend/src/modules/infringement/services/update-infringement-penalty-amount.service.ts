import { Logger } from '@logger';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Infringement, Log, LogType } from '@entities';
import { BigNumber } from 'bignumber.js';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';

@Injectable()
export class UpdateInfringementPenaltyAmountService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    @Transactional()
    async updatePenaltyAmount(infringement: Infringement) {
        this.logger.debug({
            message: 'Updating Infringement penalty amount',
            fn: this.updatePenaltyAmount.name,
        });
        const originalPenaltyAmount = infringement.penaltyAmount;
        const paid = +(await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(infringement.infringementId));
        const due = +infringement.amountDue;
        const origin = +infringement.originalAmount;
        if (paid !== 0) {
            infringement.penaltyAmount = new BigNumber(due).plus(paid).minus(origin).toFixed(2);
        } else {
            if (due - origin < 0) {
                infringement.penaltyAmount = new BigNumber(due).toFixed(2);
            } else {
                infringement.penaltyAmount = new BigNumber(due).minus(origin).toFixed(2);
            }
        }
        if (new BigNumber(infringement.penaltyAmount).isNegative()) {
            infringement.penaltyAmount = new BigNumber(0).toFixed(2);
        }

        this.logger.debug({
            message: 'Updated Infringement penalty amount',
            detail: { infringementId: infringement.infringementId, penaltyAmount: infringement.penaltyAmount },
            fn: this.updatePenaltyAmount.name,
        });
        return infringement.penaltyAmount;
    }
}
