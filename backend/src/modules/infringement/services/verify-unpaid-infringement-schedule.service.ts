import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { Infringement } from '@entities';
import { Logger } from '@logger';
import { VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { isEmpty, values } from 'lodash';
import { Promax } from 'promax';

@Injectable()
export class VerifyUnpaidInfringementScheduleService {
    constructor(private logger: Logger, private verifyInfringementService: VerifyInfringementService) {}

    // @Cron('0 9 * * 7', { name: 'verify_unpaid_infringements', timeZone: Config.get.app.timezone }) // Every Sunday at 9AM Israel
    // TODO: Still need to test this a bit more to ensure rate limiting and timing is satisfactory
    async verifyUnpaid(provider?: InfringementVerificationProvider) {
        if (!Config.get.crawlerConfig.schedulersEnabled()) {
            this.logger.debug({
                message: `Scheduled unpaid verifications sync not enabled`,
                fn: this.verifyUnpaid.name,
            });
            return;
        }

        const fn = this.verifyUnpaid.name;

        const verifiableProviders = values(Config.get.infringement.verifiableProviders);
        const query = Infringement.findUnpaid().leftJoin('infringement.issuer', 'issuer');

        if (provider) {
            query.andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, { provider });
        } else {
            query.andWhere(`issuer."integrationDetails"->>'verificationProvider' in (:...verifiableProviders)`, { verifiableProviders });
        }
        const unpaidInfringements = await query.getMany();

        if (isEmpty(unpaidInfringements)) {
            this.logger.debug({
                message: `No unpaid infringements found`,
                detail: {
                    providers: provider ? [provider] : verifiableProviders,
                },
                fn: this.verifyUnpaid.name,
            });
            return;
        }

        this.logger.debug({
            message: `InfringementScheduler: found ${unpaidInfringements.length} unpaid infringement(s) to verify`,
            detail: {
                providers: provider ? [provider] : verifiableProviders,
            },
            fn,
        });

        const promax = new Promax(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        await promax
            .add(
                unpaidInfringements.map((infringement) => async () =>
                    this.verifyInfringementService
                        .verifySingle(infringement.infringementId)
                        .catch((error) =>
                            this.logger.debug({ message: `Failed to verify infringement ${infringement.infringementId}`, fn }),
                        ),
                ),
            )
            .run();

        this.logger.debug({
            message: `Queued ${unpaidInfringements.length} unpaid infringements for verification`,
            fn,
            detail: {
                error: promax.getResultMap().error.length,
                valid: promax.getResultMap().valid.length,
            },
        });
    }
}
