import { InfringementStatus } from '@entities';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export class StatusCombinations {
    static get get() {
        return {
            defaultNew: {
                infringement: InfringementStatus.Due,
                nomination: NominationStatus.Acknowledged,
            },
            defaultOutstanding: {
                infringement: InfringementStatus.Outstanding,
                nomination: NominationStatus.Acknowledged,
            },
            paidFully: {
                infringement: InfringementStatus.Paid,
                nomination: NominationStatus.Closed,
            },
            closed: {
                infringement: InfringementStatus.Closed,
                nomination: NominationStatus.Closed,
            },
            inRedirectionProcess: {
                infringement: InfringementStatus.Due,
                nomination: NominationStatus.InRedirectionProcess,
            },
            approvedForPayment: {
                infringement: InfringementStatus.ApprovedForPayment,
                nomination: NominationStatus.Acknowledged,
            },
            appealedSuccessfully: {
                infringement: InfringementStatus.Due,
                nomination: NominationStatus.RedirectionCompleted,
            },
        };
    }
}
