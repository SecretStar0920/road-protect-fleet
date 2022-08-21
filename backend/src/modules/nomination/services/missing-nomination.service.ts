import { Injectable } from '@nestjs/common';
import { Account, Infringement, Log, LogPriority, LogType, NominationType } from '@entities';
import { Logger } from '@logger';
import { UpsertNominationService } from '@modules/nomination/services/upsert-nomination.service';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import * as moment from 'moment';

@Injectable()
export class MissingNominationService {
    constructor(private logger: Logger, private upsertNominationService: UpsertNominationService) {}

    /**
     * Adds missing nominations to the system.
     */
    async addMissingNominations() {
        const infringements = await this.findInfringementsWithoutNominations();
        const results = {
            success: 0,
            errors: [],
        };
        for (const infringement of infringements) {
            try {
                const statusUpdater = StatusUpdater.create()
                    .setSource(StatusUpdateSources.CreateInfringement)
                    .setInitialInfringement(infringement);
                await Log.createAndSave({
                    infringement,
                    type: LogType.Warning,
                    priority: LogPriority.High,
                    message: `This infringement is missing a nomination, creating one now.`,
                });
                const accountId = infringement.brn
                    ? await Account.findOneByIdOrNameOrIdentifier(infringement.brn).then((account) => account?.accountId)
                    : null;
                const redirectionCompletionDate = accountId ? null : moment().toISOString();
                await this.upsertNominationService.upsertNomination(
                    {
                        redirectionIdentifier: infringement.brn,
                        redirectionCompletionDate,
                        type: NominationType.Digital,
                        infringementId: infringement.infringementId,
                        accountId,
                    },
                    statusUpdater,
                );
                await statusUpdater.persist();
                await Log.createAndSave({
                    infringement,
                    type: LogType.Updated,
                    message: `Added a nomination to the infringement`,
                    priority: LogPriority.High,
                });
                results.success++;
            } catch (e) {
                this.logger.error({
                    fn: this.addMissingNominations.name,
                    message: `Failed to add nomination with error ${e.message} when trying to create a missing nomination for an infringement`,
                    detail: { infringement },
                });
                await Log.createAndSave({
                    infringement,
                    type: LogType.Error,
                    priority: LogPriority.High,
                    message: `Failed to create a missing nomination for the infringement with the error: ${e.message}`,
                });
                results.errors.push(e.message);
            }
        }
        return { ...results, infringements };
    }

    /**
     * Returns any infringements that do not have nominations assigned to them
     */
    async findInfringementsWithoutNominations(): Promise<Infringement[]> {
        return Infringement.createQueryBuilder('infringement')
            .leftJoin('infringement.nomination', 'nomination')
            .where('nomination.nominationId IS NULL')
            .getMany();
    }
}
