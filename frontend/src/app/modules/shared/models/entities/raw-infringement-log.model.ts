import { Timestamped } from '@modules/shared/models/timestamped';

export enum RawInfringementStatus {
    Pending = 'Pending',
    Failed = 'Failed',
    Completed = 'Completed',
}

export class RawInfringementLog extends Timestamped {
    rawInfringementId: number;
    client: any;
    data: any;
    result: any;
    noticeNumber: string;
    issuer: string;
    status: RawInfringementStatus;
}
