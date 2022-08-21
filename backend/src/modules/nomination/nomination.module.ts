import { TelavivRedirectionIntegration } from '@integrations/crawlers/telaviv/telaviv-redirection.integration';
import { Module } from '@nestjs/common';
import { NominationController } from './controllers/nomination.controller';
import { UpsertNominationService } from './services/upsert-nomination.service';
import { UpdateNominationService } from './services/update-nomination.service';
import { GetNominationService } from './services/get-nomination.service';
import { GetNominationsService } from './services/get-nominations.service';
import { DeleteNominationService } from './services/delete-nomination.service';
import { DigitallyRedirectNominationService } from '@modules/nomination/services/digitally-redirect-nomination.service';
import { NominationQueryController } from '@modules/nomination/controllers/nomination-query.controller';
import { AutomaticNominationService } from '@modules/nomination/services/automatic-nomination.service';
import { ManualPaymentModule } from '@modules/payment/modules/manual-payment/manual-payment.module';
import { AcknowledgeNominationService } from '@modules/nomination/services/acknowledge-nomination.service';
import { GetRedirectionDetailsService } from '@modules/nomination/services/get-redirection-details.service';
import { GenerateMunicipalRedirectionDocumentService } from '@modules/nomination/services/generate-municipal-redirection-document.service';
import { MunicipallyRedirectNominationService } from '@modules/nomination/services/municipally-redirect-nomination.service';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { RedirectionAutomationIntegration } from '@integrations/automation/redirection.automation-integration';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { DocumentModule } from '@modules/document/document.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { GetMunicipalPaymentDetailsService } from '@modules/payment/services/get-municipal-payment-details.service';
import { UpdateRedirectionService } from '@modules/nomination/services/update-redirection.service';
import { ExtractRedirectionAddressDetailsService } from '@modules/nomination/services/extract-redirection-address-details.service';
import { DigitalNominationHistoricalProcessingService } from '@modules/nomination/services/digital-nomination-historical-processing.service';
import { DigitalNominationCronService } from '@modules/nomination/services/digital-nomination-cron.service';
import { ManualNominationRedirectionService } from '@modules/nomination/services/manual-nomination-redirection.service';
import { MissingNominationController } from '@modules/nomination/controllers/missing-nomination.controller';
import { MissingNominationService } from '@modules/nomination/services/missing-nomination.service';
import { FixInvalidNominationsController } from '@modules/nomination/controllers/fix-invalid-nominations.controller';
import { FixInvalidRedirectionsService } from '@modules/nomination/services/fix-invalid-redirections.service';
import { FixNominationsMissingContractsService } from '@modules/nomination/services/fix-nominations-missing-contracts.service';
import { StandardNominationRulesService } from '@modules/nomination/services/standard-nomination-rules.service';
import { FixPaymentDatesService } from '@modules/nomination/services/fix-payment-dates.service';
import { FixContractualNominationsService } from '@modules/nomination/services/fix-contractual-nominations.service';
import { AutomationRedirectionService } from './services/redirection/automation-redirection.service';
import { ManualRedirectionService } from './services/redirection/manual-redirection.service';
import { TelavivRedirectionService } from './services/redirection/telaviv-redirection.service';
import { JerusalemRedirectionIntegration } from '@integrations/crawlers/jerusalem/jerusalem-redirection.integration';
import { JerusalemRedirectionService } from '@modules/nomination/services/redirection/jerusalem-redirection.service';
import { RedirectionParametersService } from '@modules/nomination/services/redirection-parameters.service';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { FixApprovedForPaymentNominationService } from '@modules/nomination/services/fix-approved-for-payment-nomination.service';
import { PoliceRedirectionService } from '@modules/nomination/services/redirection/police-redirection.service';
import { PoliceRedirectionIntegration } from '@integrations/crawlers/police/police-redirection.integration';
import { SystemUserManualRedirectionService } from '@modules/nomination/services/redirection/system-user-manual-redirection.service';
import { MileonRedirectionService } from '@modules/nomination/services/redirection/mileon-redirection.service';
import { MileonRedirectionIntegration } from '@integrations/crawlers/mileon/mileon-redirection.integration';
import { MetroparkRedirectionService } from '@modules/nomination/services/redirection/metropark-redirection.service';
import { MetroparkRedirectionIntegration } from '@integrations/crawlers/metropark/metropark-redirection.integration';
import { KfarSabaRedirectionService } from '@modules/nomination/services/redirection/kfarSaba-redirection.service';
import { KfarSabaRedirectionIntegration } from '@integrations/crawlers/kfarSaba/kfarSaba-redirection.integration';
import { City4uRedirectionService } from '@modules/nomination/services/redirection/city4u-redirection.service';
import { City4uRedirectionIntegration } from '@integrations/crawlers/city4u/city4u-redirection.integration';
import { DriverRedirectionService } from '@modules/nomination/services/redirection/driver-redirection.service';

@Module({
    controllers: [FixInvalidNominationsController, MissingNominationController, NominationController, NominationQueryController],
    providers: [
        UpsertNominationService,
        UpdateNominationService,
        GetNominationService,
        UpdateTotalPaymentsInfringementService,
        GetNominationsService,
        DeleteNominationService,
        AutomaticNominationService,
        AcknowledgeNominationService,
        GetRedirectionDetailsService,
        DriverRedirectionService,
        GenerateMunicipalRedirectionDocumentService,
        DigitallyRedirectNominationService,
        MunicipallyRedirectNominationService,
        RedirectionAutomationIntegration,
        GetMunicipalPaymentDetailsService,
        UpdateRedirectionService,
        ExtractRedirectionAddressDetailsService,
        AtgIssuers,
        DigitalNominationHistoricalProcessingService,
        DigitalNominationCronService,
        ManualNominationRedirectionService,
        MissingNominationService,
        FixInvalidRedirectionsService,
        FixNominationsMissingContractsService,
        StandardNominationRulesService,
        FixPaymentDatesService,
        FixContractualNominationsService,
        AutomationRedirectionService,
        ManualRedirectionService,
        TelavivRedirectionService,
        TelavivRedirectionIntegration,
        JerusalemRedirectionService,
        JerusalemRedirectionIntegration,
        PoliceRedirectionService,
        PoliceRedirectionIntegration,
        MileonRedirectionService,
        MileonRedirectionIntegration,
        MetroparkRedirectionService,
        MetroparkRedirectionIntegration,
        KfarSabaRedirectionService,
        KfarSabaRedirectionIntegration,
        FixApprovedForPaymentNominationService,
        RedirectionParametersService,
        SystemUserManualRedirectionService,
        City4uRedirectionIntegration,
        City4uRedirectionService,
    ],
    imports: [ManualPaymentModule, PaymentModule, GeneratedDocumentModule, DocumentModule],
    exports: [
        UpsertNominationService,
        AutomaticNominationService,
        GetRedirectionDetailsService,
        StandardNominationRulesService,
        RedirectionParametersService,
    ],
})
export class NominationModule {}
