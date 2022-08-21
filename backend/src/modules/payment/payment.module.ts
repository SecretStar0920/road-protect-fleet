import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { GetPaymentService } from './services/get-payment.service';
import { DeletePaymentService } from './services/delete-payment.service';
import { CreditGuardTokenService } from '@modules/payment/services/credit-guard-token.service';
import { GetMunicipalPaymentDetailsService } from '@modules/payment/services/get-municipal-payment-details.service';
import { PaymentMethodController } from '@modules/payment/controllers/payment-method.controller';
import { AtgIssuers } from '@integrations/automation/atg-issuers.service';
import { MunicipallyPayNominationService } from '@modules/payment/services/municipally-pay-nomination.service';
import { ManualPaymentModule } from '@modules/payment/modules/manual-payment/manual-payment.module';
import { ManualPayNominationService } from '@modules/payment/services/manual-pay-nomination.service';
import { PaymentSpreadsheetController } from '@modules/payment/controllers/payment-spreadsheet.controller';
import { CreateManualPaymentSpreadsheetService } from '@modules/payment/services/create-manual-payment-spreadsheet.service';
import { FixPaymentReferencesService } from '@modules/payment/services/fix-payment-references.service';
import { FixPaymentsController } from '@modules/payment/controllers/fix-payments.controller';
import { ExternalPaymentService } from '@modules/payment/services/external-payment.service';
import { FixExternalPaymentsService } from '@modules/payment/services/fix-external-payments.service';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';

@Module({
    controllers: [FixPaymentsController, PaymentController, PaymentMethodController, PaymentSpreadsheetController],
    providers: [
        GetPaymentService,
        DeletePaymentService,
        CreditGuardTokenService,
        GetMunicipalPaymentDetailsService,
        AtgIssuers,
        MunicipallyPayNominationService,
        UpdateTotalPaymentsInfringementService,
        ManualPayNominationService,
        CreateManualPaymentSpreadsheetService,
        FixPaymentReferencesService,
        ExternalPaymentService,
        FixExternalPaymentsService,
    ],
    imports: [ManualPaymentModule],
    exports: [CreditGuardTokenService, GetMunicipalPaymentDetailsService, ExternalPaymentService],
})
export class PaymentModule {}
