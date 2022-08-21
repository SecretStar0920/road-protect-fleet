import { JerusalemCrawlerInfringementDataService } from '@modules/crawlers/services/jerusalem-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class JerusalemCrawlerSingleJobDto {
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class JerusalemSyncSingleInfringementJob extends QueueableJob<JerusalemCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private jerusalemDataService: JerusalemCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.JerusalemSync.toString();
    }

    async run(data: JerusalemCrawlerSingleJobDto): Promise<any> {
        await this.jerusalemDataService.verifyInfringement(data.noticeNumber, data.registration, data.infringementId, data.currentBrn);
    }
}
