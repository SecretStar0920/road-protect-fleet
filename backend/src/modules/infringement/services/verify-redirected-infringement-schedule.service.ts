import { Config } from '@config/config';
import { Infringement } from '@entities';
import { Logger } from '@logger';
import { VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { isEmpty, values } from 'lodash';
import { Promax } from 'promax';

@Injectable()
export class VerifyRedirectedInfringementScheduleService {
    constructor(private logger: Logger, private verifyInfringementService: VerifyInfringementService) {}

    // Disabled for now
    // @Cron('0 02 * * * ') // Every day at 2AM
    // TODO: Still need to test this a bit more to ensure rate limiting and timing is satisfactory and that redirection logic is actually correct
    async verifyRedirected() {
        const fn = this.verifyRedirected.name;

        const verifiableProviders = values(Config.get.infringement.verifiableProviders);
        const redirectedInfringements = await Infringement.findRedirected()
            .leftJoin('infringement.issuer', 'issuer')
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' in (:...verifiableProviders)`, { verifiableProviders })
            .getMany();

        if (isEmpty(redirectedInfringements)) {
            return;
        }

        this.logger.debug({
            message: `InfringementScheduler: found ${redirectedInfringements.length} redirected infringement(s) to verify`,
            detail: null,
            fn,
        });

        const promax = new Promax(Config.get.systemPerformance.externalRequestConcurrentChunkSize, {
            throws: false,
        });
        await promax
            .add(
                redirectedInfringements.map((infringement) => () =>
                    this.verifyInfringementService
                        .verifySingle(infringement.infringementId)
                        .catch((error) =>
                            this.logger.debug({ message: `Failed to verify infringement ${infringement.infringementId}`, fn }),
                        ),
                ),
            )
            .run();

        this.logger.debug({
            message: `Verified ${redirectedInfringements.length} redirected infringements`,
            fn,
            detail: {
                error: promax.getResultMap().error.length,
                valid: promax.getResultMap().valid.length,
            },
        });
    }
}
