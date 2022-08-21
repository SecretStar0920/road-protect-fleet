import { TelavivCrawlerInfringementDataService } from '@modules/crawlers/services/telaviv-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class TelavivCrawlerSingleJobDto {
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class TelavivSyncSingleInfringementJob extends QueueableJob<TelavivCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private telavivDataService: TelavivCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.TelavivSync.toString();
    }

    async run(data: TelavivCrawlerSingleJobDto): Promise<any> {
        await this.telavivDataService.verifyInfringement(data.noticeNumber, data.registration, data.infringementId, data.currentBrn);
    }
}
