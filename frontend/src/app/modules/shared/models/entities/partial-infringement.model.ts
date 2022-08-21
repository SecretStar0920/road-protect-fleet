import { Timestamped } from '@modules/shared/models/timestamped';
import { InfringementType } from '@modules/shared/models/entities/infringement.model';

export enum PartialInfringementStatus {
    Pending = 'Pending',
    Queued = 'Queued',
    Processed = 'Processed',
    Successful = 'Successful',
    Failed = 'Failed',
}

export class PartialInfringement extends Timestamped {
    partialInfringementId: number;
    details: PartialInfringementDetails;
    status: PartialInfringementStatus;
    noticeNumber?: string;
    processedDate: string;
    response?: any;
}
export class PartialInfringementDetails {
    noticeNumber?: string;
    brn?: string;
    vehicle?: string;
    provider?: string; // The crawler to use on the system
    issuerCode?: string; // The code of the issuer as existing on the system
    issuerName?: string; // The name of the issuer as existing on the system
    caseNumber?: string;
    issuerStatus?: string;
    issuerStatusDescription?: string;
    reason?: string;
    reasonCode?: string;
    type?: InfringementType;
    amountDue?: string;
    originalAmount?: string;
    offenceDate?: string;
    latestPaymentDate?: string;
}
