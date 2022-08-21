import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement, LeaseContract, Log, LogPriority, LogType, NominationType } from '@entities';
import { Promax } from 'promax';
import { Config } from '@config/config';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
/**
 * The goal of this service is to fix infringements that have been nominated
 * to the owner when is a user.
 */
export class FixContractualNominationsService {
    constructor(private logger: Logger) {}

    async fix() {
        this.logger.log({
            fn: this.fix.name,
            message: `Running the fix to renominate infringements that were nominated to the owner when they should be nominated to the user`,
        });

        const infringements = await this.getInfringements();

        this.logger.log({
            fn: this.fix.name,
            message: `Found ${infringements.length} infringements that should be investigated.`,
        });

        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        }).add(infringements.map((inf) => async () => this.checkInfringement(inf)));

        this.logger.log({
            fn: this.fix.name,
            message: `Mapped the infringements and starting to run.`,
        });

        await promax.run();

        return promax.getResultMap();
    }

    private async getInfringements() {
        return Infringement.findWithMinimalRelations()
            .where('account.accountId != contractUser.accountId')
            .andWhere('nomination.status NOT IN (:...statuses)', {
                statuses: [NominationStatus.RedirectionCompleted],
            })
            .andWhere('contractUser.accountId IS NOT NULL')
            .getMany();
    }

    private async checkInfringement(infringement: Infringement) {
        this.logger.log({
            fn: this.checkInfringement.name,
            message: `Checking infringement ${infringement.noticeNumber}`,
        });
        const user = (infringement.contract as LeaseContract).user;
        if (
            infringement.nomination.type === NominationType.Digital &&
            infringement.nomination.account.accountId === infringement.contract.owner.accountId
        ) {
            this.logger.log({
                fn: this.checkInfringement.name,
                message: `This infringement ${infringement.noticeNumber} had an invalid nomination`,
                detail: { infringement },
            });
            infringement.nomination.redirectedFrom = infringement.nomination.account;
            infringement.nomination.account = user;
            await infringement.nomination.save();
            await Log.createAndSave({
                infringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: `The digital nomination was incorrect and is being corrected to the contract user`,
            });
            return infringement.noticeNumber;
        }
        if (infringement.nomination.status === NominationStatus.InRedirectionProcess) {
            if (infringement.nomination.rawRedirectionIdentifier === infringement.contract.owner.identifier) {
                this.logger.log({
                    fn: this.checkInfringement.name,
                    message: `This infringement ${infringement.noticeNumber} had an invalid nomination`,
                    detail: { infringement },
                });
                infringement.nomination.redirectedFrom = infringement.nomination.account;
                infringement.nomination.rawRedirectionIdentifier = user.identifier;
                infringement.nomination.account = user;
                await infringement.nomination.save();
                await Log.createAndSave({
                    infringement,
                    type: LogType.Warning,
                    priority: LogPriority.High,
                    message: `The digital nomination was incorrect and is being corrected to the contract user`,
                });
                return infringement.noticeNumber;
            }
            if (infringement.nomination.rawRedirectionIdentifier === user.identifier) {
                this.logger.log({
                    fn: this.checkInfringement.name,
                    message: `This infringement ${infringement.noticeNumber} had an invalid nomination`,
                    detail: { infringement },
                });
                infringement.nomination.redirectedFrom = infringement.nomination.account;
                infringement.nomination.account = user;
                await infringement.nomination.save();
                await Log.createAndSave({
                    infringement,
                    type: LogType.Warning,
                    priority: LogPriority.High,
                    message: `The digital nomination was incorrect and is being corrected to the contract user`,
                });
                return infringement.noticeNumber;
            }
        }
        if (infringement.nomination.rawRedirectionIdentifier === infringement.brn || infringement.brn === user.identifier) {
            this.logger.log({
                fn: this.checkInfringement.name,
                message: `This infringement ${infringement.noticeNumber} had an invalid nomination`,
                detail: { infringement },
            });
            infringement.nomination.type = NominationType.Municipal;
            infringement.nomination.redirectedFrom = infringement.nomination.account;
            infringement.nomination.account = user;
            await infringement.nomination.save();
            await Log.createAndSave({
                infringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: `The nomination was incorrect and is being corrected to the municipal result`,
            });
            return infringement.noticeNumber;
        }
        if (infringement.nomination.type === NominationType.Municipal) {
            if (
                infringement.nomination.rawRedirectionIdentifier === null &&
                (infringement.brn === null || infringement.brn === infringement.contract.owner.identifier)
            ) {
                infringement.nomination.type = NominationType.Digital;
                infringement.nomination.redirectedFrom = infringement.nomination.account;
                infringement.nomination.account = user;
                await infringement.nomination.save();
                await Log.createAndSave({
                    infringement,
                    type: LogType.Warning,
                    priority: LogPriority.High,
                    message: `The nomination was incorrect and is being corrected digitally from a municipal redirection`,
                });
                return infringement.noticeNumber;
            }
        }
        return false;
    }
}
