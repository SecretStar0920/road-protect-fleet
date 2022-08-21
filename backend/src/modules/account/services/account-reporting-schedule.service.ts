import { Injectable, LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AccountReportNotificationService } from '@modules/account/services/account-report-notification.service';
import { Logger } from '@logger';
import { Config } from '@config/config';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class AccountReportingScheduleService {

    constructor(
        private accountReportingService: AccountReportNotificationService,
        private logger: Logger
    ) {
    }

    @Cron(Config.get.infringementReportConfig.unmanagedCronFrequency, {
        timeZone: Config.get.app.timezone,
    })
    @Transactional()
    @Cron('* * 22 * *', { name: 'send_reports' })
    async sendReports() {
        this.logger.debug({
            message: `Sending reports`,
            fn: this.sendReports.name,
        });

        try {
            await this.accountReportingService.sendReportToAllAccounts()
        } catch (e) {
            this.logger.error({
                message: `Failed to send reports`,
                fn: this.sendReports.name,
            });
        }

    }

}
