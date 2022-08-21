import { AtgInfringementDataService } from '@modules/partners/modules/atg/services/atg-infringement-data.service';
import { QueueNames } from '@modules/queue/queue-names.enum';
import { QueueableJob } from '@modules/queue/queueable.job';
import { QueueService } from '@modules/queue/services/queue.service';
import { Injectable } from '@nestjs/common';

export class AtgSingleJobDto {
    issuerCityCode: string;
    issuerCityName: string;
    registration: string;
    noticeNumber: string;
    infringementId?: number;
    currentBrn?: string;
}

@Injectable()
export class AtgSyncSingleInfringementJob extends QueueableJob<AtgSingleJobDto> {
    constructor(private queueService: QueueService, private atgDataService: AtgInfringementDataService) {
        super(queueService);
        this.queueName = QueueNames.AtgSync.toString();
    }

    async run(data: AtgSingleJobDto): Promise<any> {
        await this.atgDataService.verifyInfringement(data.issuerCityCode, data.issuerCityName, data.noticeNumber, data.registration, data.currentBrn);
    }
}
