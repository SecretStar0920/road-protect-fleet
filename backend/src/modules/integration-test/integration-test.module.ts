import { AddVehicleAutomationIntegration } from '@integrations/automation/vehicle/add-vehicle.automation-integration';
import { UpdateVehicleAutomationIntegration } from '@integrations/automation/vehicle/update-vehicle.automation-integration';
import { VerifyInfringementAutomationIntegration } from '@integrations/automation/verify-infringement.automation-integration';
import { CrawlersModule } from '@modules/crawlers/crawlers.module';
import { PoliceCrawlerSyncIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/police-crawler-sync-integration-test.service';
import { Module } from '@nestjs/common';
import { IntegrationTestController } from './controllers/integration-test.controller';
import { JerusalemCrawlerSyncIntegrationTest } from './services/crawler-integration-tests/jerusalem-crawler-sync-integration-test.service';
import { MileonCrawlerSyncIntegrationTest } from './services/crawler-integration-tests/mileon-crawler-sync-integration-test.service';
import { TelavivCrawlerSyncIntegrationTest } from './services/crawler-integration-tests/telaviv-crawler-sync-integration-test.service';
import { IntegrationFactory, IntegrationTestService } from './services/integration-test.service';
import { TelavivCrawlerSyncWithNoticeNumberIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/telaviv-crawler-sync-with-notice-number-integration-test.service';
import { PoliceCrawlerSyncWithCaseNumberIntegrationTest } from '@modules/integration-test/services/crawler-integration-tests/police-crawler-sync-with-case-number-integration-test.service';

@Module({
    imports: [CrawlersModule],
    controllers: [IntegrationTestController],
    providers: [
        IntegrationFactory,
        IntegrationTestService,
        VerifyInfringementAutomationIntegration,
        AddVehicleAutomationIntegration,
        UpdateVehicleAutomationIntegration,
        JerusalemCrawlerSyncIntegrationTest,
        TelavivCrawlerSyncIntegrationTest,
        TelavivCrawlerSyncWithNoticeNumberIntegrationTest,
        PoliceCrawlerSyncWithCaseNumberIntegrationTest,
        MileonCrawlerSyncIntegrationTest,
        PoliceCrawlerSyncIntegrationTest,
    ],
})
export class IntegrationTestModule {}
