import { Injectable } from '@nestjs/common';
import { LogType } from '@entities';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { InfringementLogService } from '@modules/infringement/services/infringement-log.service';
import * as Bull from 'bull';

export class SaveNewInfringementLogJobDto {
    infringementId: number;
    vehicleId?: number;
    userId?: number;
    accountId?: number;
    type: LogType;
    message: string;
}

@Injectable()
export class SaveNewInfringementLogJob extends QueueableJob<SaveNewInfringementLogJobDto> {
    // For this job, we want it to wait a little bit before running so we delay
    // it by a small time period and then add it
    private readonly DEFAULT_DELAY_MS = 2000;

    constructor(private queueService: QueueService, private infringementLogService: InfringementLogService) {
        super(queueService);
        this.queueName = QueueNames.InfringementLog;
    }

    async dispatchJob(data: SaveNewInfringementLogJobDto, options: Bull.JobOptions = {}, userId?: number) {
        return super.dispatchJob(
            data,
            {
                delay: this.DEFAULT_DELAY_MS,
                ...options,
            },
            userId,
        );
    }

    async run(data: SaveNewInfringementLogJobDto): Promise<any> {
        return await this.infringementLogService.createLog({
            type: data.type,
            message: data.message,
            infringement: {
                infringementId: data.infringementId,
            },
            vehicle: {
                vehicleId: data.vehicleId,
            },
            user: {
                userId: data.userId,
            },
            account: {
                accountId: data.accountId,
            },
        });
    }
}
