import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { FailedPaymentEmailService } from './services/failed-payment-email.service';
import { AdminEmailService } from '@modules/shared/modules/email/services/admin-email.service';
import { ClusterNodeChangeEmailService } from '@modules/shared/modules/email/services/cluster-node-change-email.service';

@Module({
    providers: [EmailService, ClusterNodeChangeEmailService, FailedPaymentEmailService, AdminEmailService],
    exports: [EmailService, FailedPaymentEmailService, AdminEmailService],
})
export class EmailModule {}
