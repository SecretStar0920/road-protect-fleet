import { Injectable } from '@nestjs/common';
import { Infringement, InfringementStatus } from '@entities';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class StandardInfringementRulesService {
    applyRules(infringement: Infringement) {
        if (infringement.status === InfringementStatus.Paid) {
            infringement.amountDue = new BigNumber(0).toFixed(2);
        }
        if (Number(infringement.amountDue) === 0) {
            infringement.status = InfringementStatus.Due || InfringementStatus.Outstanding ? InfringementStatus.Paid : infringement.status;
        }
        return infringement;
    }
}
