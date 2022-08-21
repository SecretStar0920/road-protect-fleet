import { TelavivCrawlerInfringementDataService } from '@modules/crawlers/services/telaviv-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class TelavivCrawlerJobDto {
    identifier: string;
}

@Injectable()
export class TelavivSyncMultipleInfringementsJob extends QueueableJob<TelavivCrawlerJobDto> {
    constructor(private queueService: QueueService, private telavivDataService: TelavivCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.TelavivSync.toString();
    }

    async run(data: TelavivCrawlerJobDto): Promise<any> {
        const dto = await this.telavivDataService.createSyncDto(data.identifier);
        await this.telavivDataService.syncMultipleInfringements(dto);
    }
}
