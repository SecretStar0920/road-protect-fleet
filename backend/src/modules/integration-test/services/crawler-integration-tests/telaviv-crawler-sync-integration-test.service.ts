import {
    TelavivCrawlerInfringementDataService,
    TelavivCrawlerSyncDto,
} from '@modules/crawlers/services/telaviv-crawler-infringement-data.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';

export class TelavivTestCrawlerSyncDto {
    identifier: string;
}

@Injectable()
export class TelavivCrawlerSyncIntegrationTest extends TestableIntegration {
    constructor(private dataService: TelavivCrawlerInfringementDataService) {
        super();
    }

    async runTest(dto: TelavivTestCrawlerSyncDto): Promise<any> {
        const body = await this.getBody(dto);
        return this.dataService.syncMultipleInfringements(body);
    }

    async getBody(dto: TelavivTestCrawlerSyncDto): Promise<TelavivCrawlerSyncDto> {
        return this.dataService.createSyncDto(dto.identifier);
    }
}
