import { Injectable } from '@nestjs/common';
import { Infringement, InfringementStatus, Log, LogPriority, LogType, Nomination, NominationType } from '@entities';
import { Logger } from '@logger';
import { LinkingService } from '@modules/shared/services/linking.service';
import { chunk, cloneDeep } from 'lodash';
import { Config } from '@config/config';
import { Promax } from 'promax';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class FixInvalidRedirectionsService {
    constructor(private logger: Logger, private linkingService: LinkingService) {}

    async fixInvalidRedirections() {
        this.logger.debug({
            fn: this.fixInvalidRedirections.name,
            message: `Running the fix invalid redirections function`,
        });
        const nominations = await this.getNominations();

        this.logger.debug({
            fn: this.fixInvalidRedirections.name,
            message: `Found ${nominations.length} nominations`,
        });

        const infringementIds = nominations.map((nomination) => nomination.infringement.infringementId);
        const infringements = await this.getInfringements(infringementIds);

        this.logger.debug({
            fn: this.fixInvalidRedirections.name,
            message: `Pulled ${infringements.length} infringements`,
        });

        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: true,
        });
        promax.add(infringements.map((inf) => () => this.fixInfringement(inf)));
        await promax.run();
        return promax.getResultMap();
    }

    private async getNominations() {
        return await Nomination.createQueryBuilder('nomination')
            .innerJoinAndSelect('nomination.infringement', 'infringement')
            .where('nomination.status IN (:...redirectionStatuses)', {
                redirectionStatuses: [NominationStatus.InRedirectionProcess, NominationStatus.RedirectionCompleted],
            })
            .getMany();
    }

    private async getInfringements(infringementIds: number[]) {
        const chunks = chunk(infringementIds, Config.get.systemPerformance.queryChunkSize);
        const allInfringements: Infringement[][] = [];
        for (const ids of chunks) {
            this.logger.debug({
                fn: this.getInfringements.name,
                message: `Pulling ${ids.length} infringements`,
            });
            allInfringements.push(
                await Infringement.findWithMinimalRelations()
                    .where('infringement.infringementId IN (:...ids)', { ids })
                    .innerJoinAndSelect('infringement.infringementRevisionHistory', 'infringementRevisionHistory')
                    .getMany(),
            );
        }
        return allInfringements.reduce((a, b) => a.concat(b));
    }

    private async fixInfringement(infringement: Infringement) {
        this.logger.debug({
            fn: this.fixInfringement.name,
            message: `Fixing infringement`,
            detail: { infringement },
        });
        const currentBrn = infringement.brn;
        let isRedirected = false;
        infringement.infringementRevisionHistory.forEach((history) => {
            if (history.old && history.old['brn'] !== null && history.old['brn'] !== currentBrn) {
                isRedirected = true;
            }
        });
        if (isRedirected) {
            this.logger.debug({
                fn: this.fixInfringement.name,
                message: `The infringement has already been successfully redirected`,
                detail: { infringement },
            });
            return { ...this.extractInfringementData(infringement), valid: true };
        }
        // At this point, there wasn't a redirection but we have that there was

        // The redirection identifier is different so it is undergoing redirection
        if (
            infringement.nomination.status === NominationStatus.InRedirectionProcess &&
            infringement.nomination.rawRedirectionIdentifier !== currentBrn &&
            infringement.nomination.rawRedirectionIdentifier !== null
        ) {
            this.logger.debug({
                fn: this.fixInfringement.name,
                message: `The infringement is in redirection process and raw identifier is not the same as the current brn`,
                detail: { infringement },
            });
            return { ...this.extractInfringementData(infringement), valid: true };
        }

        // Before the redirection identifier, we'd just nominate an account so
        // this is around that.
        if (
            infringement.nomination.status === NominationStatus.InRedirectionProcess &&
            infringement.nomination.rawRedirectionIdentifier === null &&
            infringement.nomination.account?.identifier !== currentBrn
        ) {
            this.logger.debug({
                fn: this.fixInfringement.name,
                message: `The infringement is in redirection process and raw identifier is null`,
                detail: { infringement },
            });
            return { ...this.extractInfringementData(infringement), valid: true };
        }

        // The redirection actually went through to a different brn
        if (
            infringement.nomination.status === NominationStatus.RedirectionCompleted &&
            infringement.nomination.rawRedirectionIdentifier !== currentBrn &&
            infringement.nomination.rawRedirectionIdentifier !== null
        ) {
            this.logger.debug({
                fn: this.fixInfringement.name,
                message: `Already redirected and the raw identifier is not the same as the brn`,
                detail: { infringement },
            });
            return { ...this.extractInfringementData(infringement), valid: true };
        }

        this.logger.warn({
            fn: this.fixInfringement.name,
            message: `Found an invalid infringement redirection`,
            detail: { infringement },
        });

        await Log.createAndSave({
            infringement,
            type: LogType.Error,
            priority: LogPriority.High,
            message: `This infringement was incorrectly redirected, resetting the nomination`,
        });

        const nomination = infringement.nomination;
        const nominationBefore = cloneDeep(infringement.nomination);
        nomination.rawRedirectionIdentifier = null;
        nomination.status =
            infringement.status === InfringementStatus.Paid || infringement.status === InfringementStatus.Closed
                ? NominationStatus.Closed
                : NominationStatus.Acknowledged;
        nomination.account = infringement.contract?.owner;
        nomination.type = NominationType.Digital;
        nomination.details = {
            acknowledgedFor: {
                redirection: false,
                payment: false,
                appeal: false,
            },
            redirectionReason: '',
        };
        nomination.redirectionLetterSendDate = null;
        nomination.redirectedDate = null;
        nomination.nominationDate = null;
        nomination.redirectedFrom = null;
        nomination.redirectionType = null;
        await nomination.save();

        const statusUpdater = StatusUpdater.create()
            .setSource(StatusUpdateSources.UpdateInfringement)
            .setInitialInfringement(infringement)
            .setInitialNomination(nomination);
        await this.linkingService.linkInfringementContractAndResolveNomination(infringement, statusUpdater);

        return { ...this.extractInfringementData(infringement), nominationBefore, valid: false };
    }

    private extractInfringementData(infringement: Infringement) {
        return {
            infringementId: infringement.infringementId,
            nominationId: infringement.nomination?.nominationId,
            brn: infringement.brn,
            identifier: infringement.nomination?.rawRedirectionIdentifier,
        };
    }
}
