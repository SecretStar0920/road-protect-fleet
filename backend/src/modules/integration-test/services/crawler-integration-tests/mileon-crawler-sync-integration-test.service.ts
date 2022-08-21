import { MileonCrawlerJobDto } from '@modules/crawlers/jobs/mileon-sync-multiple-infringements.job';
import {
    MileonCrawlerInfringementDataService,
    MileonCrawlerSyncDto,
} from '@modules/crawlers/services/mileon-crawler-infringement-data.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MileonCrawlerSyncIntegrationTest extends TestableIntegration {
    constructor(private dataService: MileonCrawlerInfringementDataService) {
        super();
    }

    async runTest(dto: MileonCrawlerJobDto): Promise<any> {
        const body = await this.getBody(dto);
        return this.dataService.syncMultipleInfringements(body);
    }

    async getBody(dto: MileonCrawlerJobDto): Promise<MileonCrawlerSyncDto> {
        return this.dataService.createSyncDto(dto.registration, dto.issuerIdentifier);
    }
}
