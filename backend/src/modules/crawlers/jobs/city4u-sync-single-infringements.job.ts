import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';
import { City4uCrawlerInfringementDataService } from '@modules/crawlers/services/city4u-crawler-infringement-data.service';

export class City4uCrawlerSingleJobDto {
    issuerId: number;
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class City4uSyncSingleInfringementsJob extends QueueableJob<City4uCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private city4uDataService: City4uCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.City4uSync.toString();
    }

    async run(data: City4uCrawlerSingleJobDto): Promise<any> {
        await this.city4uDataService.verifyInfringement(
            data.issuerId,
            data.noticeNumber,
            data.registration,
            data.infringementId,
            data.currentBrn,
        );
    }
}
