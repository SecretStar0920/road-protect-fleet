import { MileonCrawlerInfringementDataService } from '@modules/crawlers/services/mileon-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class MileonCrawlerJobDto {
    registration: string;
    issuerIdentifier: string;
}

@Injectable()
export class MileonSyncMultipleInfringementsJob extends QueueableJob<MileonCrawlerJobDto> {
    constructor(private queueService: QueueService, private mileonDataService: MileonCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.MileonSync.toString();
    }

    async run(data: MileonCrawlerJobDto): Promise<any> {
        const dto = await this.mileonDataService.createSyncDto(data.registration, data.issuerIdentifier);
        await this.mileonDataService.syncMultipleInfringements(dto);
    }
}
