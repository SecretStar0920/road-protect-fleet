import { Logger } from '@logger';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Injectable } from '@nestjs/common';
import { Infringement, Log, LogPriority, LogType } from '@entities';
import { Config } from '@config/config';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class UpdateInfringementOriginalAmountService {
    constructor(private logger: Logger) {}

    @Transactional()
    async updateOriginalAmount(infringement: Infringement): Promise<string> {
        const amountDue = new BigNumber(infringement.amountDue);
        // If the amount due reduces to be less than the original amount
        // the original amount is redefined to the respective adjustOriginalAmount
        const previousOriginalAmount = new BigNumber(infringement.originalAmount).toFixed(2);
        if (
            amountDue.isLessThan(Config.get.infringement.adjustOriginalAmount.levelTwo) &&
            amountDue.isGreaterThanOrEqualTo(Config.get.infringement.adjustOriginalAmount.levelOne)
        ) {
            infringement.originalAmount = new BigNumber(Config.get.infringement.adjustOriginalAmount.levelOne).toFixed(2);
        } else if (
            amountDue.isLessThan(Config.get.infringement.adjustOriginalAmount.levelThree) &&
            amountDue.isGreaterThanOrEqualTo(Config.get.infringement.adjustOriginalAmount.levelTwo)
        ) {
            infringement.originalAmount = new BigNumber(Config.get.infringement.adjustOriginalAmount.levelTwo).toFixed(2);
        } else if (
            amountDue.isLessThan(Config.get.infringement.adjustOriginalAmount.levelFour) &&
            amountDue.isGreaterThanOrEqualTo(Config.get.infringement.adjustOriginalAmount.levelThree)
        ) {
            infringement.originalAmount = new BigNumber(Config.get.infringement.adjustOriginalAmount.levelThree).toFixed(2);
        } else if (amountDue.isGreaterThanOrEqualTo(Config.get.infringement.adjustOriginalAmount.levelFour)) {
            // Round to the nearest 1000 (Config.get.infringement.adjustOriginalAmount.levelFour)
            infringement.originalAmount = amountDue
                .dividedToIntegerBy(Config.get.infringement.adjustOriginalAmount.levelFour)
                .multipliedBy(Config.get.infringement.adjustOriginalAmount.levelFour)
                .toFixed(2);
        }
        if (!new BigNumber(infringement.originalAmount).isEqualTo(previousOriginalAmount)) {
            this.logger.warn({
                message: `Request to update original amount of infringement`,
                detail: {
                    noticeNumber: infringement.noticeNumber,
                    previousOriginalAmount,
                    originalAmount: infringement.originalAmount,
                    amountDue: amountDue.toFixed(2),
                },
                fn: this.updateOriginalAmount.name,
            });
            await Log.createAndSave({
                priority: LogPriority.High,
                infringement,
                type: LogType.Warning,
                message: `Updating original amount of infringement from ${previousOriginalAmount} to ${infringement.originalAmount}`,
            });
        }
        return infringement.originalAmount;
    }
}
