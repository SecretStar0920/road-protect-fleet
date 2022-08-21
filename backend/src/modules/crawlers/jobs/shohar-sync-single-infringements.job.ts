import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';
import { ShoharCrawlerInfringementDataService } from '@modules/crawlers/services/shohar-crawler-infringement-data.service';

export class ShoharCrawlerSingleJobDto {
    issuerId: number;
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class ShoharSyncSingleInfringementsJob extends QueueableJob<ShoharCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private shoharDataService: ShoharCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.ShoharSync.toString();
    }

    async run(data: ShoharCrawlerSingleJobDto): Promise<any> {
        await this.shoharDataService.verifyInfringement(
            data.issuerId,
            data.noticeNumber,
            data.registration,
            data.infringementId,
            data.currentBrn,
        );
    }
}
