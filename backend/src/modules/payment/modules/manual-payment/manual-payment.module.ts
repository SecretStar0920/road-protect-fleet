import { Module } from '@nestjs/common';
import { ManualPaymentController } from './controllers/manual-payment.controller';
import { CreateManualPaymentService } from './services/create-manual-payment.service';
import { UpdateManualPaymentService } from './services/update-manual-payment.service';
import { GetManualPaymentService } from './services/get-manual-payment.service';
import { GetManualPaymentsService } from './services/get-manual-payments.service';
import { DeleteManualPaymentService } from './services/delete-manual-payment.service';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';

@Module({
    controllers: [ManualPaymentController],
    providers: [
        CreateManualPaymentService,
        UpdateManualPaymentService,
        GetManualPaymentService,
        GetManualPaymentsService,
        DeleteManualPaymentService,
        UpdateTotalPaymentsInfringementService,
    ],
    imports: [],
    exports: [CreateManualPaymentService],
})
export class ManualPaymentModule {}
