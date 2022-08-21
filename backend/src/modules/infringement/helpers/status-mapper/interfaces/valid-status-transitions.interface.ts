import { IInfringementStatusTransition } from '@modules/infringement/helpers/status-mapper/interfaces/infringement-status-transition.type';
import { INominationStatusTransition } from '@modules/infringement/helpers/status-mapper/interfaces/nomination-status-transition.type';

export interface IValidStatusTransitions {
    infringement: IInfringementStatusTransition;
    nomination: INominationStatusTransition;
}
