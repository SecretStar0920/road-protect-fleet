import { NominationStatus } from '@modules/shared/models/nomination-status';

export type INominationStatusTransition = {
    [key in NominationStatus]?: NominationStatus[];
};
