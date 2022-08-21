import { Injectable } from '@nestjs/common';
import { Infringement, InfringementStatus, Nomination } from '@entities';
import * as momentTimezone from 'moment-timezone';
import { Config } from '@config/config';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class StandardNominationRulesService {
    async applyRules(infringement: Infringement, nomination: Nomination) {
        // Make sure we set the payment date when the amount due is set to 0
        if (Number(infringement.amountDue) === 0) {
            nomination.paidDate = nomination.paidDate || momentTimezone.tz(Config.get.app.timezone).toISOString();
        }

        // Close the nomination if the infringement is paid and not undergoing
        // redirection.
        if (
            infringement.status === InfringementStatus.Paid &&
            nomination.status !== NominationStatus.InRedirectionProcess &&
            nomination.status !== NominationStatus.RedirectionCompleted
        ) {
            nomination.status = NominationStatus.Closed;
        }

        return nomination;
    }
}
