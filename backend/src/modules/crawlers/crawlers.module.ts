import { VerifyInfringementJerusalemIntegration } from '@integrations/crawlers/jerusalem/verify-infringement-jerusalem.integration';
import { VerifyInfringementMetroparkIntegration } from '@integrations/crawlers/metropark/verify-infringement-metropark.integration';
import { VerifyInfringementKfarSabaIntegration } from '@integrations/crawlers/kfarSaba/verify-infringement-kfarSaba.integration';
import { VerifyInfringementMileonIntegration } from '@integrations/crawlers/mileon/verify-infringement-mileon.integration';
import { VerifyInfringementPoliceIntegration } from '@integrations/crawlers/police/verify-infringement-police.integration';
import { VerifyInfringementShoharIntegration } from '@integrations/crawlers/shohar/verify-infringement-shohar.integration';
import { VerifyInfringementCity4uIntegration } from '@integrations/crawlers/city4u/verify-infringement-city4u.integration';
import { VerifyBulkInfringementTelavivIntegration } from '@integrations/crawlers/telaviv/verify-bulk-infringement-telaviv.integration';
import { VerifySingleInfringementTelavivIntegration } from '@integrations/crawlers/telaviv/verify-single-infringement-telaviv.integration';
import { JerusalemSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/jerusalem-sync-multiple-infringements.job';
import { JerusalemSyncSingleInfringementJob } from '@modules/crawlers/jobs/jerusalem-sync-single-infringement.job';
import { MetroparkSyncSingleInfringementJob } from '@modules/crawlers/jobs/metropark-sync-single-infringement.job';
import { KfarSabaSyncSingleInfringementJob } from '@modules/crawlers/jobs/kfarSaba-sync-single-infringement.job';
import { MileonSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/mileon-sync-multiple-infringements.job';
import { MileonSyncSingleInfringementJob } from '@modules/crawlers/jobs/mileon-sync-single-infringement.job';
import { PoliceSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/police-sync-multiple-infringements.job';
import { PoliceSyncSingleInfringementJob } from '@modules/crawlers/jobs/police-sync-single-infringement.job';
import { ShoharSyncSingleInfringementsJob } from '@modules/crawlers/jobs/shohar-sync-single-infringements.job';
import { City4uSyncSingleInfringementsJob } from '@modules/crawlers/jobs/city4u-sync-single-infringements.job';
import { TelavivSyncMultipleInfringementsJob } from '@modules/crawlers/jobs/telaviv-sync-multiple-infringements.job';
import { TelavivSyncSingleInfringementJob } from '@modules/crawlers/jobs/telaviv-sync-single-infringement.job';
import { MileonSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/mileon-sync-multiple-infringements-schedule.service';
import { PoliceSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/police-sync-multiple-infringements-schedule.service';
import { TelavivSyncMultipleInfringementsScheduleService } from '@modules/crawlers/schedules/telaviv-sync-multiple-infringements-schedule.service';
import { MetroparkCrawlerInfringementDataService } from '@modules/crawlers/services/metropark-crawler-infringement-data.service';
import { KfarSabaCrawlerInfringementDataService } from '@modules/crawlers/services/kfarSaba-crawler-infringement-data.service';
import { MileonCrawlerInfringementDataService } from '@modules/crawlers/services/mileon-crawler-infringement-data.service';
import { ShoharCrawlerInfringementDataService } from '@modules/crawlers/services/shohar-crawler-infringement-data.service';
import { City4uCrawlerInfringementDataService } from '@modules/crawlers/services/city4u-crawler-infringement-data.service';
import { TelavivCrawlerInfringementDataService } from '@modules/crawlers/services/telaviv-crawler-infringement-data.service';
import { GetIssuerExternalCodeService } from '@modules/issuer/services/get-issuer-external-code.service';
import { AtgModule } from '@modules/partners/modules/atg/atg.module';
import { QueueModule } from '@modules/queue/queue.module';
import { RawInfringementModule } from '@modules/raw-infringement/raw-infringement.module';
import { Module } from '@nestjs/common';
import { CrawlerDataController } from './controllers/crawler-data.controller';
import { JerusalemSyncMultipleInfringementsScheduleService } from './schedules/jerusalem-sync-multiple-infringements-schedule.service';
import { JerusalemCrawlerInfringementDataService } from './services/jerusalem-crawler-infringement-data.service';
import { PoliceCrawlerInfringementDataService } from './services/police-crawler-infringement-data.service';

@Module({
    imports: [RawInfringementModule, QueueModule, AtgModule],
    providers: [
        JerusalemCrawlerInfringementDataService,
        TelavivCrawlerInfringementDataService,
        MileonCrawlerInfringementDataService,
        MetroparkCrawlerInfringementDataService,
        KfarSabaCrawlerInfringementDataService,
        PoliceCrawlerInfringementDataService,
        ShoharCrawlerInfringementDataService,
        City4uCrawlerInfringementDataService,
        VerifyInfringementJerusalemIntegration,
        VerifyInfringementShoharIntegration,
        VerifyInfringementCity4uIntegration,
        VerifySingleInfringementTelavivIntegration,
        VerifyBulkInfringementTelavivIntegration,
        VerifyInfringementMileonIntegration,
        VerifyInfringementMetroparkIntegration,
        VerifyInfringementKfarSabaIntegration,
        VerifyInfringementPoliceIntegration,
        GetIssuerExternalCodeService,
        JerusalemSyncMultipleInfringementsJob,
        JerusalemSyncMultipleInfringementsScheduleService,
        TelavivSyncMultipleInfringementsJob,
        TelavivSyncMultipleInfringementsScheduleService,
        MileonSyncMultipleInfringementsJob,
        MileonSyncMultipleInfringementsScheduleService,
        PoliceSyncMultipleInfringementsJob,
        PoliceSyncMultipleInfringementsScheduleService,
        JerusalemSyncSingleInfringementJob,
        MileonSyncSingleInfringementJob,
        PoliceSyncSingleInfringementJob,
        TelavivSyncSingleInfringementJob,
        MetroparkSyncSingleInfringementJob,
        KfarSabaSyncSingleInfringementJob,
        ShoharSyncSingleInfringementsJob,
        City4uSyncSingleInfringementsJob
    ],
    controllers: [CrawlerDataController],
    exports: [
        JerusalemCrawlerInfringementDataService,
        TelavivCrawlerInfringementDataService,
        MileonCrawlerInfringementDataService,
        MetroparkCrawlerInfringementDataService,
        KfarSabaCrawlerInfringementDataService,
        ShoharCrawlerInfringementDataService,
        City4uCrawlerInfringementDataService,
        PoliceCrawlerInfringementDataService,
        JerusalemSyncSingleInfringementJob,
        MileonSyncSingleInfringementJob,
        PoliceSyncSingleInfringementJob,
        TelavivSyncSingleInfringementJob,
        MetroparkSyncSingleInfringementJob,
        KfarSabaSyncSingleInfringementJob,
        ShoharSyncSingleInfringementsJob,
        City4uSyncSingleInfringementsJob,
    ],
})
export class CrawlersModule {}
