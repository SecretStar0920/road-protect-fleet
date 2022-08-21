import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { EmailService, EmailTemplate } from '@modules/shared/modules/email/services/email.service';
import { exec } from 'child_process';
import { Config } from '@config/config';
import { ClusterNodeChangeEmail } from '@modules/shared/modules/email/interfaces/email.interface';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ClusterNodeChangeEmailService {
    constructor(private logger: Logger, private emailService: EmailService) {}

    // EVERY HOUR
    @Cron('0 * * * *', { name: 'cluster-node-change-check' })
    async checkClusterNodeChange() {
        this.logger.debug({
            message: 'PINGing ATG server to determine if cluster has changed',
            detail: { internalIP: Config.get.automation.internalIP },
            fn: this.checkClusterNodeChange.name,
        });
        // PING server and see if it can be reached
        exec(` ping -c 1 ${Config.get.automation.internalIP}`, async (error, stdout, stderr) => {
            if (error) {
                this.logger.error({
                    message: 'Failed to PING ATG server, cluster node must have changed.',
                    detail: { error: error.message, stdout, stderr },
                    fn: this.checkClusterNodeChange.name,
                });
                // Send email notification of failure
                await this.sendClusterNodeChangeEmail();
            } else {
                this.logger.debug({
                    message: 'Successfully PINGed ATG server, cluster node has not changed.',
                    detail: { stdout },
                    fn: this.checkClusterNodeChange.name,
                });
            }
        });
    }

    private async sendClusterNodeChangeEmail() {
        this.logger.debug({
            message: 'Sending email to notify of error.',
            detail: { emailing: Config.get.clusterChangeEmailAddresses },
            fn: this.checkClusterNodeChange.name,
        });

        for (const person of Config.get.clusterChangeEmailAddresses) {
            const context: ClusterNodeChangeEmail = { name: person.name, internalIP: Config.get.automation.internalIP };
            const details = {
                template: EmailTemplate.ClusterNodeChange,
                to: person.email,
                subject: 'URGENT: The IP address of the Fleet Cluster Node has changed',
                context,
            };
            await this.emailService.sendEmail(details);
        }
    }
}
