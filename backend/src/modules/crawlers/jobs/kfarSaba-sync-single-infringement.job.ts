import { KfarSabaCrawlerInfringementDataService } from '@modules/crawlers/services/kfarSaba-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class KfarSabaCrawlerSingleJobDto {
    issuerId: number;
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class KfarSabaSyncSingleInfringementJob extends QueueableJob<KfarSabaCrawlerSingleJobDto> {
    constructor(private queueService: QueueService, private kfarSabaDataService: KfarSabaCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.KfarSabaSync.toString();
    }

    async run(data: KfarSabaCrawlerSingleJobDto): Promise<any> {
        await this.kfarSabaDataService.verifyInfringement(
            data.issuerId,
            data.noticeNumber,
            data.registration,
            data.infringementId,
            data.currentBrn,
        );
    }
}
