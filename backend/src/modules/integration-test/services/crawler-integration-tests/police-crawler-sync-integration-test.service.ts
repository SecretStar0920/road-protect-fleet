import { PoliceCrawlerJobDto } from '@modules/crawlers/jobs/police-sync-multiple-infringements.job';
import {
    PoliceCrawlerInfringementDataService,
    PoliceCrawlerSyncDto,
} from '@modules/crawlers/services/police-crawler-infringement-data.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PoliceCrawlerSyncIntegrationTest extends TestableIntegration {
    constructor(private dataService: PoliceCrawlerInfringementDataService) {
        super();
    }

    async runTest(dto: PoliceCrawlerJobDto): Promise<any> {
        const body = await this.getBody(dto);
        return this.dataService.syncMultipleInfringements(body);
    }

    async getBody(dto: PoliceCrawlerJobDto): Promise<PoliceCrawlerSyncDto> {
        return this.dataService.createSyncDto(dto.identifier);
    }
}
