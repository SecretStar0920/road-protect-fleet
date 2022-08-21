import { VerifyRedirectedInfringementScheduleService } from '@modules/infringement/services/verify-redirected-infringement-schedule.service';
import { Module } from '@nestjs/common';
import { InfringementController } from './controllers/infringement.controller';
import { CreateInfringementService } from './services/create-infringement.service';
import { UpdateInfringementService } from './services/update-infringement.service';
import { GetInfringementService } from './services/get-infringement.service';
import { GetInfringementsService } from './services/get-infringements.service';
import { DeleteInfringementService } from './services/delete-infringement.service';
import { InfringementScheduleService } from '@modules/infringement/services/infringement-schedule.service';
import { NominationModule } from '@modules/nomination/nomination.module';
import { InfringementQueryController } from '@modules/infringement/controllers/infringement-query.controller';
import { InfringementSpreadsheetController } from '@modules/infringement/controllers/infringement-spreadsheet.controller';
import { CreateInfringementSpreadsheetService } from '@modules/infringement/services/create-infringement.spreadsheet-service';
import { LocationModule } from '@modules/location/location.module';
import { UpdateInfringementSpreadsheetService } from '@modules/infringement/services/update-infringement.spreadsheet-service';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { IturanIntegration } from '@integrations/ituran/ituran-integration';
import { CreateInfringementNotification } from '@modules/infringement/services/create-infringement-notification.service';
import { InfringementReportingByAccountRelationService } from './services/infringement-reporting-by-account-relation.service';
import { InfringementReportController } from './controllers/infringement-report.controller';
import { InfringementReportingByAccountService } from '@modules/infringement/services/infringement-reporting-by-account.service';
import { UpsertInfringementService } from '@modules/infringement/services/upsert-infringement.service';
import { UpsertInfringementSpreadsheetService } from '@modules/infringement/services/upsert-infringement.spreadsheet-service';
import { InfringementReportingGenerateHtmlService } from '@modules/infringement/services/infringement-reporting-generate-html.service';
import { ManualInfringementRedirectionService } from '@modules/infringement/services/manual-infringement-redirection.service';
import { ManualInfringementRedirectionSpreadsheetService } from '@modules/infringement/services/manual-infringement-redirection.spreadsheet-service';
import { ManualInfringementRedirectionController } from '@modules/infringement/controllers/manual-infringement-redirection.controller';
import { VerifyUnpaidInfringementScheduleService } from './services/verify-unpaid-infringement-schedule.service';
import { FixInfringementDataService } from '@modules/infringement/services/fix-infringement-data.service';
import { FixInfringementController } from '@modules/infringement/controllers/fix-infringement.controller';
import { FixDuplicateInfringementsService } from '@modules/infringement/services/fix-duplicate-infringements.service';
import { FixOutstandingInfringementService } from '@modules/infringement/services/fix-outstanding-infringement.service';
import { PaymentModule } from '@modules/payment/payment.module';
import { StandardInfringementRulesService } from '@modules/infringement/services/standard-infringement-rules.service';
import { InfringementLogService } from '@modules/infringement/services/infringement-log.service';
import { SaveNewInfringementLogJob } from '@modules/infringement/jobs/save-new-infringement-log.job';
import { QueueModule } from '@modules/queue/queue.module';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { UpdateInfringementOriginalAmountService } from '@modules/infringement/services/update-infringement-original-amount.service';
import { UpdateInfringementPenaltyAmountService } from '@modules/infringement/services/update-infringement-penalty-amount.service';
import { ApproveInfringementForPaymentService } from '@modules/infringement/services/approve-infringement-for-payment.service';
import { UnapproveInfringementForPaymentService } from '@modules/infringement/services/unapprove-infringement-for-payment.service';
import { VerifyInfringementModule } from '@modules/infringement/verify-infringement.module';
import { InfringementNoteModule } from '@modules/infringement-note/infringement-note.module';
import { FixInvalidStatusTransitionsController } from '@modules/infringement/controllers/fix-invalid-status-transitions.controller';
import { FixInvalidStatusTransitionsService } from '@modules/infringement/services/fix-invalid-status-transitions.service';
import { InfringementVerificationController } from '@modules/infringement/controllers/infringement-verification.controller';
import { FixPaymentAmountsService } from '@modules/infringement/services/fix-payment-amounts.service';
import { GraphingModule } from '@modules/graphing/graphing.module';

@Module({
    controllers: [
        // The order of this is important, if we put the spreadsheet controller
        // is under the normal one, the verify won't work.
        FixInfringementController,
        InfringementSpreadsheetController,
        InfringementController,
        InfringementQueryController,
        InfringementReportController,
        ManualInfringementRedirectionController,
        FixInvalidStatusTransitionsController,
        InfringementVerificationController,
    ],
    providers: [
        FixPaymentAmountsService,
        CreateInfringementService,
        UpdateInfringementService,
        UpdateInfringementOriginalAmountService,
        GetInfringementService,
        GetInfringementsService,
        DeleteInfringementService,
        InfringementScheduleService,
        UpdateInfringementPenaltyAmountService,
        CreateInfringementSpreadsheetService,
        UpdateInfringementSpreadsheetService,
        IturanIntegration,
        CreateInfringementNotification,
        InfringementReportingByAccountRelationService,
        InfringementReportingByAccountService,
        UpsertInfringementService,
        UpsertInfringementSpreadsheetService,
        InfringementReportingGenerateHtmlService,
        ManualInfringementRedirectionService,
        ManualInfringementRedirectionSpreadsheetService,
        VerifyUnpaidInfringementScheduleService,
        VerifyRedirectedInfringementScheduleService,
        FixInfringementDataService,
        FixDuplicateInfringementsService,
        FixOutstandingInfringementService,
        StandardInfringementRulesService,
        InfringementLogService,
        SaveNewInfringementLogJob,
        UpdateTotalPaymentsInfringementService,
        ApproveInfringementForPaymentService,
        UnapproveInfringementForPaymentService,
        FixInvalidStatusTransitionsService,
    ],
    imports: [
        //
        VerifyInfringementModule,
        VehicleModule,
        NominationModule,
        LocationModule,
        PaymentModule,
        QueueModule,
        InfringementNoteModule,
        GraphingModule,
    ],
    exports: [CreateInfringementService, UpdateInfringementService],
})
export class InfringementModule {}
