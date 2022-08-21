import { User } from '@modules/shared/models/entities/user.model';
import { Timestamped } from '@modules/shared/models/timestamped';

export enum JobStatus {
    Queued = 'Queued',
    InProgress = 'Processing',
    Completed = 'Completed',
    Failed = 'Failed',
    Cancelled = 'Cancelled',
}

export class JobLog extends Timestamped {
    jobId: number;
    uuid: string;
    startTime?: string;
    endTime?: string;
    queue: string;
    type: string;
    status: JobStatus;
    details: any;
    error?: any;
    user?: User;
}
