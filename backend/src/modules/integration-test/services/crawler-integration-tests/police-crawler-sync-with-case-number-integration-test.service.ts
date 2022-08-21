import {
    PoliceCrawlerInfringementDataService,
    PoliceCrawlerSyncDto,
} from '@modules/crawlers/services/police-crawler-infringement-data.service';
import { TestableIntegration } from '@modules/integration-test/models/testable-integration.model';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';

export class PoliceCrawlerWithCaseNumberDto {
    identifier: string;
    caseNumber: string;
}

@Injectable()
export class PoliceCrawlerSyncWithCaseNumberIntegrationTest extends TestableIntegration {
    constructor(private dataService: PoliceCrawlerInfringementDataService, private logger: Logger) {
        super();
    }

    async runTest(dto: PoliceCrawlerWithCaseNumberDto): Promise<any> {
        const body = await this.getBody(dto);
        return this.dataService.syncMultipleInfringements(body);
    }

    async getBody(dto: PoliceCrawlerWithCaseNumberDto): Promise<PoliceCrawlerSyncDto> {
        return {
            identifier: dto.identifier,
            caseNumber: dto.caseNumber,
        };
    }
}
