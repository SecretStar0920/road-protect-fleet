import {
    TelavivCrawlerInfringementDataService,
    TelavivCrawlerSyncDto,
} from '@modules/crawlers/services/telaviv-crawler-infringement-data.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';

export class TelavivTestCrawlerSyncWithNoticeNumberDto {
    identifier: string;
    noticeNumber: string;
    registration: string;
}

@Injectable()
export class TelavivCrawlerSyncWithNoticeNumberIntegrationTest extends TestableIntegration {
    constructor(private dataService: TelavivCrawlerInfringementDataService, private logger: Logger) {
        super();
    }

    async runTest(dto: TelavivTestCrawlerSyncWithNoticeNumberDto): Promise<any> {
        const body = await this.getBody(dto);
        return this.dataService.syncMultipleInfringements(body);
    }

    async getBody(dto: TelavivTestCrawlerSyncWithNoticeNumberDto): Promise<TelavivCrawlerSyncDto> {
        const telavivCrawlerSyncDto: TelavivCrawlerSyncDto = {
            noticeNumber: dto.noticeNumber,
            registration: dto.registration,
            identifier: dto.identifier,
        };

        return telavivCrawlerSyncDto;
    }
}
