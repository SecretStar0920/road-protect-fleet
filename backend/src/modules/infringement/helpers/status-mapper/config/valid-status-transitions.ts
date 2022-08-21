import { IValidStatusTransitions } from '@modules/infringement/helpers/status-mapper/interfaces/valid-status-transitions.interface';
import { InfringementStatus } from '@entities';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export const validStatusTransitions: IValidStatusTransitions = {
    infringement: {
        [InfringementStatus.Due]: [
            InfringementStatus.Outstanding,
            InfringementStatus.ApprovedForPayment,
            InfringementStatus.Paid,
            InfringementStatus.Closed,
            InfringementStatus.Collection,
        ],
        [InfringementStatus.Outstanding]: [
            InfringementStatus.Due,
            InfringementStatus.ApprovedForPayment,
            InfringementStatus.Paid,
            InfringementStatus.Closed,
            InfringementStatus.Collection,
        ],
        [InfringementStatus.Paid]: [
            InfringementStatus.Due,
            InfringementStatus.Outstanding,
            InfringementStatus.Collection,
        ],
        [InfringementStatus.Closed]: [
            InfringementStatus.Paid,
            InfringementStatus.Due,
            InfringementStatus.Outstanding,
            InfringementStatus.Collection,
        ],
        [InfringementStatus.ApprovedForPayment]: [
            InfringementStatus.Due,
            InfringementStatus.Outstanding,
            InfringementStatus.Paid,
            InfringementStatus.Closed,
            InfringementStatus.Collection,
        ],
        [InfringementStatus.Collection]: [
            InfringementStatus.Due,
            InfringementStatus.Outstanding,
            InfringementStatus.Paid,
            InfringementStatus.Closed,
            InfringementStatus.ApprovedForPayment,
        ],
        [InfringementStatus.Unmanaged]: [
            InfringementStatus.Due,
            InfringementStatus.Outstanding,
            InfringementStatus.Paid,
            InfringementStatus.Closed,
            InfringementStatus.ApprovedForPayment,
        ],
    },
    nomination: {
        [NominationStatus.Pending]: [
            NominationStatus.Acknowledged,
            NominationStatus.Closed,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted,
        ],
        [NominationStatus.Acknowledged]: [
            NominationStatus.Pending,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted,
            NominationStatus.Closed,
        ],
        [NominationStatus.RedirectionCompleted]: [
            NominationStatus.Pending,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted,
            NominationStatus.Closed,
            NominationStatus.Acknowledged,
        ],
        [NominationStatus.RedirectionRequestError]: [
            NominationStatus.Pending,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted,
            NominationStatus.Closed,
            NominationStatus.Acknowledged,
        ],
        [NominationStatus.RedirectionError]: [
            NominationStatus.Pending,
            NominationStatus.InRedirectionProcess,
            NominationStatus.RedirectionCompleted,
            NominationStatus.Closed,
            NominationStatus.Acknowledged,
            NominationStatus.RedirectionRequestError,
        ],
        [NominationStatus.InRedirectionProcess]: [
            NominationStatus.RedirectionCompleted,
            NominationStatus.RedirectionError,
            NominationStatus.Acknowledged,
            NominationStatus.InRedirectionProcess,
            NominationStatus.Closed,
        ],
        [NominationStatus.Closed]: [
            NominationStatus.Acknowledged,
            NominationStatus.Pending,  
        ],
    },
};
