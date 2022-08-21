import { PoliceCrawlerInfringementDataService } from '@modules/crawlers/services/police-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class PoliceCrawlerSingleJobDto {
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class PoliceSyncSingleInfringementJob extends QueueableJob<PoliceCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private policeDataService: PoliceCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.PoliceSync.toString();
    }

    async run(data: PoliceCrawlerSingleJobDto): Promise<any> {
        await this.policeDataService.verifyInfringement(data.noticeNumber, data.infringementId, data.currentBrn);
    }
}
