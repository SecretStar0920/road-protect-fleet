import { InfringementStatus } from '@entities';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export type IStatusCombination = {
    infringement: InfringementStatus;
    nomination: NominationStatus;
};
