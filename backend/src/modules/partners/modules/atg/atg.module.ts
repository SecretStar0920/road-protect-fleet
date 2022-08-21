import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { VerifyInfringementAutomationIntegration } from '@integrations/automation/verify-infringement.automation-integration';
import { AtgSyncSingleInfringementJob } from '@modules/partners/modules/atg/jobs/atg-sync-single-infringement.job';
import { AtgSyncMultipleInfringementsScheduleService } from '@modules/partners/modules/atg/schedules/atg-sync-multiple-infringements-schedule.service';
import { QueueModule } from '@modules/queue/queue.module';
import { RawInfringementModule } from '@modules/raw-infringement/raw-infringement.module';
import { Module } from '@nestjs/common';
import { AtgInfringementDataService } from './services/atg-infringement-data.service';

@Module({
    imports: [RawInfringementModule, QueueModule],
    providers: [
        AtgInfringementDataService,
        AtgIssuers,
        VerifyInfringementAutomationIntegration,
        AtgSyncSingleInfringementJob,
        AtgSyncMultipleInfringementsScheduleService,
    ],
    exports: [AtgInfringementDataService, AtgSyncSingleInfringementJob, AtgSyncMultipleInfringementsScheduleService],
})
export class AtgModule {}
