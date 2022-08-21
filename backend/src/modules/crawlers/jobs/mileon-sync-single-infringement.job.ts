import { MileonCrawlerInfringementDataService } from '@modules/crawlers/services/mileon-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class MileonCrawlerSingleJobDto {
    issuerId: number;
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class MileonSyncSingleInfringementJob extends QueueableJob<MileonCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private mileonDataService: MileonCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.MileonSync.toString();
    }

    async run(data: MileonCrawlerSingleJobDto): Promise<any> {
        await this.mileonDataService.verifyInfringement(
            data.issuerId,
            data.noticeNumber,
            data.registration,
            data.infringementId,
            data.currentBrn,
        );
    }
}
