import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { EmailContext } from '@modules/shared/modules/email/interfaces/email.interface';
import { Config } from '@config/config';

@Injectable()
export class AdminEmailService {
    constructor(private logger: Logger, private emailService: EmailService) {}

    async sendEmailToAdmins(contextAdmins: EmailContext, subject: string) {
        const adminEmailAddresses = Config.get.adminEmailAddresses;

        for (const admin of adminEmailAddresses) {
            const context = {
                ...contextAdmins,
                name: admin.name,
            };
            await this.emailService.sendEmail({
                template: EmailTemplate.FailedPaymentAdminNotification,
                to: admin.email,
                subject,
                context,
            });
        }
    }
}
