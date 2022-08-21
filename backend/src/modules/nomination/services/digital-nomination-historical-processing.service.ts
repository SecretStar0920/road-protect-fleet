import { Injectable } from '@nestjs/common';
import { DigitallyRedirectNominationService } from '@modules/nomination/services/digitally-redirect-nomination.service';
import { Infringement, NominationTarget, NominationType } from '@entities';
import { Logger } from '@logger';
import { chunk } from 'lodash';
import { Config } from '@config/config';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class DigitalNominationHistoricalProcessingService {
    constructor(private digitallyRedirectNominationService: DigitallyRedirectNominationService, private logger: Logger) {}

    async processSingleHistoricalInfringement(infringementId: number) {
        this.logger.log({
            message: `Running the digital nomination across the single infringement with id ${infringementId}`,
            fn: this.processSingleHistoricalInfringement.name,
            detail: { infringementId },
        });
        const infringement = await Infringement.findWithMinimalRelations()
            .where('infringement.infringementId = :infringementId', { infringementId })
            .andWhere('contractUser.accountId IS NOT NULL')
            .andWhere('account.accountId != contractUser.accountId')
            .getOne();

        if (!infringement) {
            this.logger.log({
                message: `The infringement with id ${infringementId} does not meet the minimum requirements for the digital redirection to the contract user.`,
                fn: this.processSingleHistoricalInfringement.name,
                detail: { infringementId },
            });
            return null;
        }

        const statusUpdater = StatusUpdater.create()
            .setSource(StatusUpdateSources.UpdateInfringement)
            .setInitialInfringement(infringement)
            .setInitialNomination(infringement.nomination);
        await this.digitallyRedirectNominationService.digitallyRedirectNomination(
            infringement.nomination.nominationId,
            {
                to: NominationTarget.User,
            },
            statusUpdater,
        );

        await statusUpdater.resolveStatusUpdates().throwIfInvalidStatusTransition().persist();
        return infringement;
    }

    async processAllHistoricalInfringements() {
        this.logger.log({
            message: 'Running the digital nomination across all historical infringements',
            fn: this.processAllHistoricalInfringements.name,
        });
        const infringements = await Infringement.findWithMinimalRelations()
            .where('contractUser.accountId IS NOT NULL')
            .andWhere('account.accountId != contractUser.accountId')
            .andWhere('nomination.status NOT IN (:...statuses)', {
                statuses: [NominationStatus.InRedirectionProcess, NominationStatus.RedirectionCompleted],
            })
            .andWhere('nomination.redirectedDate IS NULL')
            .getMany();
        this.logger.debug({
            message: `Found ${infringements.length} infringements to run through`,
            fn: this.processAllHistoricalInfringements.name,
        });

        const chunks = chunk(infringements, Config.get.databases.general.defaultChunkSize);
        this.logger.debug({
            message: `We have ${chunks.length} chunks to run through`,
            fn: this.processAllHistoricalInfringements.name,
        });
        let total = 0;
        const totalResults = [];
        for (const chunk of chunks) {
            try {
                const results = await this.digitallyRedirectNominationService.batchDigitallyRedirectNomination({
                    nominationIds: chunk.map((infringement) => infringement.nomination).map((nomination) => nomination.nominationId),
                    to: NominationTarget.User,
                });
                totalResults.push(results);
                this.logger.log({
                    message: `Completed the nominations`,
                    fn: this.processAllHistoricalInfringements.name,
                });
            } catch (e) {
                this.logger.error({
                    message: `Failed to run a batch digital nomination with the following error ${e.message}`,
                    fn: this.processAllHistoricalInfringements.name,
                });
            }

            total += chunk.length;
            this.logger.debug({
                message: `Completed ${total} infringements so far`,
                fn: this.processAllHistoricalInfringements.name,
            });
        }

        return totalResults;
    }

    async count() {
        return await Infringement.findWithMinimalRelations()
            .where('contractUser.accountId IS NOT NULL')
            .andWhere('account.accountId != contractUser.accountId')
            .getCount();
    }

    async clearNominationsWhereContractIsMissing() {
        this.logger.log({
            message: `Clear nomination where the contract is missing`,
            fn: this.processSingleHistoricalInfringement.name,
            detail: {},
        });
        const invalidInfringements = await Infringement.findWithMinimalRelations()
            .leftJoin('infringementContract.owner', 'contractOwner')
            .andWhere('contractUser.accountId IS NULL')
            .andWhere('account.accountId IS NOT NULL')
            .andWhere('contractOwner.accountId != account.accountId')
            .andWhere('nomination.type = :type', {
                type: NominationType.Digital,
            })
            .andWhere('nomination.status NOT IN (:...status)', {
                status: [NominationStatus.InRedirectionProcess, NominationStatus.RedirectionCompleted],
            })
            .getMany();

        if (invalidInfringements.length > 0) {
            this.logger.warn({
                message: `There were ${invalidInfringements.length} infringements that have nominations but do not have contracts.`,
                detail: { invalidInfringements },
                fn: this.clearNominationsWhereContractIsMissing.name,
            });
        } else {
            this.logger.log({
                message: `There were no infringements that had nominations with missing contracts!`,
                fn: this.clearNominationsWhereContractIsMissing.name,
            });
            return;
        }

        for (const infringement of invalidInfringements) {
            // this.logger.log({
            //     message: `Removing the account from the infringement ${infringement.infringementId} and nomination ${infringement.nomination.nominationId}`,
            //     fn: this.clearNominationsWhereContractIsMissing.name,
            //     detail: { infringement },
            // });
            // await Log.createAndSave({
            //     infringement,
            //     type: LogType.Updated,
            //     message: 'Infringement has invalid nomination: Contract missing',
            // });
            // infringement.nomination.account = null;
            // await infringement.nomination.save();
            // await Log.createAndSave({
            //     infringement,
            //     type: LogType.Updated,
            //     message: 'Infringement nomination updated with no contract user',
            // });
        }

        return invalidInfringements;
    }

    async countNominationsWhereContractIsMissing() {
        return await Infringement.findWithMinimalRelations()
            .leftJoin('infringementContract.owner', 'contractOwner')
            .andWhere('contractUser.accountId IS NULL')
            .andWhere('account.accountId IS NOT NULL')
            .andWhere('contractOwner.accountId != account.accountId')
            .andWhere('nomination.type = :type', {
                type: NominationType.Digital,
            })
            .andWhere('nomination.status NOT IN (:...status)', {
                status: [NominationStatus.InRedirectionProcess, NominationStatus.RedirectionCompleted],
            })
            .getCount();
    }
}
