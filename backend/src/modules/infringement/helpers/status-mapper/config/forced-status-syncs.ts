import { InfringementStatus } from '@entities';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export const forcedStatusSyncs = {
    [InfringementStatus.Closed]: NominationStatus.Closed,
    // I'm commenting this out because we discussed that you can redirect an
    // infringement after it has been paid to avoid demerit points.
    // [InfringementStatus.Paid]: NominationStatus.Closed,
};
