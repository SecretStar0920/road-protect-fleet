import { MetroparkCrawlerInfringementDataService } from '@modules/crawlers/services/metropark-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class MetroparkCrawlerSingleJobDto {
    issuerId: number;
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class MetroparkSyncSingleInfringementJob extends QueueableJob<MetroparkCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private metroparkDataService: MetroparkCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.MetroparkSync.toString();
    }

    async run(data: MetroparkCrawlerSingleJobDto): Promise<any> {
        await this.metroparkDataService.verifyInfringement(
            data.issuerId,
            data.noticeNumber,
            data.registration,
            data.infringementId,
            data.currentBrn,
        );
    }
}
