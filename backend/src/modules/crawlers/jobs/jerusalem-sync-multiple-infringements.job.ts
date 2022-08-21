import { JerusalemCrawlerInfringementDataService } from '@modules/crawlers/services/jerusalem-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class JerusalemCrawlerJobDto {
    registration: string;
    identifier: string;
}

@Injectable()
export class JerusalemSyncMultipleInfringementsJob extends QueueableJob<JerusalemCrawlerJobDto> {
    constructor(private queueService: QueueService, private jerusalemDataService: JerusalemCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.JerusalemSync.toString();
    }

    async run(data: JerusalemCrawlerJobDto): Promise<any> {
        const dto = await this.jerusalemDataService.createSyncDto(data.registration, data.identifier);
        await this.jerusalemDataService.syncMultipleInfringements(dto);
    }
}
