import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { EmailService } from '@modules/shared/modules/email/services/email.service';
import { FailedPaymentAdminEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { AdminEmailService } from '@modules/shared/modules/email/services/admin-email.service';

@Injectable()
export class FailedPaymentEmailService {
    constructor(private logger: Logger, private emailService: EmailService, private emailAdminsService: AdminEmailService) {}

    async sendFailedPaymentEmail(failedPaymentEmail: FailedPaymentDetails) {
        // const contextUser: FailedPaymentUserEmail = {
        //     name: failedPaymentEmail.userName,
        //     lang: 'en',
        //     paymentDate: failedPaymentEmail.paymentDate,
        //     paymentId: failedPaymentEmail.paymentId,
        //     infringementNoticeNumber: failedPaymentEmail.infringementNoticeNumber,
        // };
        //
        // await this.emailService.sendEmail({ template: EmailTemplate.FailedPaymentUserNotification, to: failedPaymentEmail.userEmail, subject: 'Your payment failed', context: contextUser });

        const contextAdmins: FailedPaymentAdminEmail = {
            name: 'defaultName',
            lang: 'en',
            userName: failedPaymentEmail.userName,
            userEmail: failedPaymentEmail.userEmail,
            errorMessage: failedPaymentEmail.errorMessage,
        };

        await this.emailAdminsService.sendEmailToAdmins(contextAdmins, 'A payment failed');
    }
}

export class FailedPaymentDetails {
    userName: string;
    userEmail: string;
    paymentId: string;
    paymentDate: string;
    infringementNoticeNumber: string;
    errorMessage?: any;
}
