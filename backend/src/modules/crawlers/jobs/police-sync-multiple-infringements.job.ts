import { PoliceCrawlerInfringementDataService } from '@modules/crawlers/services/police-crawler-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class PoliceCrawlerJobDto {
    identifier: string;
}

@Injectable()
export class PoliceSyncMultipleInfringementsJob extends QueueableJob<PoliceCrawlerJobDto> {
    constructor(private queueService: QueueService, private policeDataService: PoliceCrawlerInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.PoliceSync.toString();
    }

    async run(data: PoliceCrawlerJobDto): Promise<any> {
        const dto = await this.policeDataService.createSyncDto(data.identifier);
        await this.policeDataService.syncMultipleInfringements(dto);
    }
}
