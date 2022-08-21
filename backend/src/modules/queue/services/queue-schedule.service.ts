import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Job, JobStatus } from '@entities';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import { Config } from '@config/config';
import { JobService } from '@modules/job/services/job.service';

@Injectable()
export class QueueScheduleService {
    constructor(private logger: Logger, private jobLogService: JobService) {}

    // Every night at midnight
    @Cron('0 0 * * *', { name: 'cancel_jobs' })
    async cancelOldJobs() {
        const oldJobQualifyingDate = moment().subtract(Config.get.queue.oldJobQualifyTime, 'days').toISOString();
        this.logger.debug({
            message: 'Cancelling old jobs created before: ',
            detail: oldJobQualifyingDate,
            fn: this.cancelOldJobs.name,
        });

        const oldJobs = await Job.createQueryBuilder('job')
            .andWhere(`job.updatedAt < :date`, { date: oldJobQualifyingDate })
            .andWhere('job.status IN (:...statuses)', { statuses: [JobStatus.Queued, JobStatus.InProgress] })
            .getMany();

        if (isEmpty(oldJobs)) {
            this.logger.debug({
                message: 'No old jobs found',
                fn: this.cancelOldJobs.name,
            });
            return;
        }

        this.logger.debug({
            message: `Cancelling ${oldJobs.length} old jobs`,
            fn: this.cancelOldJobs.name,
        });

        for (const job of oldJobs) {
            await this.jobLogService.upsertJobLog({
                uuid: job.uuid,
                jobType: job.type,
                queueName: job.queue,
                data: job.details,
                status: JobStatus.Cancelled,
            });
        }
    }
}
