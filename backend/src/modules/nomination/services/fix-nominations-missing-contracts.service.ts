import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { LinkingService } from '@modules/shared/services/linking.service';
import { Infringement } from '@entities';
import { Promax } from 'promax';
import { Config } from '@config/config';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';

@Injectable()
export class FixNominationsMissingContractsService {
    constructor(private logger: Logger, private linkingService: LinkingService) {}

    async fixMissingContracts() {
        this.logger.debug({
            fn: this.fixMissingContracts.name,
            message: `Running the fix for missing contracts`,
        });
        const infringements = await Infringement.findWithMinimalRelations()
            .where('account.accountId IS NULL')
            .andWhere('infringementContract.contractId IS NOT NULL')
            .getMany();

        if (infringements.length > 0) {
            this.logger.warn({
                fn: this.fixMissingContracts.name,
                message: `Found ${infringements.length} infringements that have nominations without contracts...`,
            });
        }
        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        promax.add(
            infringements.map((inf) => async () => {
                this.logger.debug({
                    fn: this.fixMissingContracts.name,
                    message: `Fixing the infringement ${inf.infringementId} that does not have a contract on the nomination`,
                    detail: inf,
                });
                const statusUpdater = StatusUpdater.create().setSource(StatusUpdateSources.UpdateInfringement).setInitialInfringement(inf);
                if (inf.nomination) {
                    statusUpdater.setInitialNomination(inf.nomination);
                }
                await this.linkingService.linkInfringementContractAndResolveNomination(inf, statusUpdater);
                await statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition().persist();
            }),
        );
        await promax.run();
        return promax.getResultMap();
    }
}
