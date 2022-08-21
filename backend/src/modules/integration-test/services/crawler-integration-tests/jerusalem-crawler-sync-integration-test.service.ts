import { JerusalemCrawlerJobDto } from '@modules/crawlers/jobs/jerusalem-sync-multiple-infringements.job';
import {
    JerusalemCrawlerInfringementDataService,
    JerusalemCrawlerSyncDto,
} from '@modules/crawlers/services/jerusalem-crawler-infringement-data.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JerusalemCrawlerSyncIntegrationTest extends TestableIntegration {
    constructor(private dataService: JerusalemCrawlerInfringementDataService) {
        super();
    }

    async runTest(dto: JerusalemCrawlerJobDto): Promise<any> {
        const body = await this.getBody(dto);
        return this.dataService.syncMultipleInfringements(body);
    }

    async getBody(dto: JerusalemCrawlerJobDto): Promise<JerusalemCrawlerSyncDto> {
        return this.dataService.createSyncDto(dto.registration, dto.identifier);
    }
}
