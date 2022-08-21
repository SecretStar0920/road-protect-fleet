import { Job, JobStatus, User } from '@entities';
import { Logger } from '@logger';
import { Injectable } from '@nestjs/common';
import moment = require('moment');

export class JobDto {
    uuid: string;
    status: JobStatus;
    queueName: string;
    jobType: string;
    data: any;
    userId?: number;
    error?: any;
}

@Injectable()
export class JobService {
    constructor(private logger: Logger) {}

    async upsertJobLog(log: JobDto) {
        try {
            // Find job
            let job = await Job.findOne({ uuid: log.uuid });

            if (!job) {
                job = await this.createJobLog(log);
            }
            await this.updateJobLog(job, log.status, log.error);
        } catch (error) {
            this.logger.error({
                message: 'Failed to upsert job log',
                fn: this.createJobLog.name,
                detail: { log, message: error.message, stack: error.stack },
            });
        }
    }

    private async createJobLog(log: JobDto) {
        const job = await Job.create({
            uuid: log.uuid,
            status: log.status,
            type: log.jobType,
            queue: log.queueName,
            details: {
                data: log.data,
            },
        });

        if (log.userId) {
            job.user = await User.findOne(log.userId);
        }
        return await job.save();
    }

    private async updateJobLog(job: Job, status: JobStatus, error?: any) {
        job.status = status;

        if (job.status === JobStatus.InProgress) {
            job.startTime = moment().toISOString();
        }

        if (job.status === JobStatus.Completed || job.status === JobStatus.Failed || job.status === JobStatus.Cancelled) {
            job.endTime = moment().toISOString();
        }

        if (job.status === JobStatus.Failed && error) {
            job.error = {
                message: error.message,
                stack: error.stack,
            };
        }

        await job.save();
    }
}
