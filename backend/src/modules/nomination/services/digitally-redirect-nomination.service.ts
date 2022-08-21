import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import {
    Account,
    Contract,
    Document,
    LeaseContract,
    Log,
    LogPriority,
    LogType,
    Nomination,
    NominationTarget,
    NominationType,
    User,
    Vehicle,
} from '@entities';
import { cloneDeep, isNil } from 'lodash';
import { DigitalRedirectionDto } from '@modules/nomination/dtos/digital-redirection.dto';
import { BatchDigitalRedirectionDto } from '@modules/nomination/dtos/batch-digital-redirection.dto';
import { Brackets } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { StatusUpdateSources } from '@modules/infringement/helpers/status-updater/status-update-sources.enum';
import { NominationHasBeenRedirectedException } from '@modules/nomination/exceptions/nomination-has-been-redirected.exception';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class DigitallyRedirectNominationService {
    constructor(private logger: Logger) {}

    @Transactional()
    async digitallyRedirectNomination(nominationId: number, dto: DigitalRedirectionDto, statusUpdater: StatusUpdater): Promise<Nomination> {
        // TODO: implement some permission checking, eg: can only change from account you represent
        this.logger.log({
            message: 'Digitally redirecting Nomination: ',
            detail: { nominationId, dto },
            fn: this.digitallyRedirectNomination.name,
        });

        const nomination = await this.findNomination(nominationId);

        if (this.isAlreadyNominated(nomination, dto)) {
            this.logger.log({
                message: 'The nomination has already been nominated',
                detail: {
                    nomination,
                    dto,
                },
                fn: this.digitallyRedirectNomination.name,
            });
            return nomination;
        }

        //await this.assertNotBeingRedirected(nomination);

        const account = await this.findAccount(nomination, dto.to);
        await this.assertAccountUsersExist(account.accountId);
        await this.assertVehicleIsRelatedToAccount(nomination, account.accountId);

        // Keep track of the old account that the nomination was pointing at
        nomination.redirectedFrom = cloneDeep(nomination.account);

        // Reset infringement
        nomination.account = account;
        nomination.type = NominationType.Digital;

        // Save document
        if (dto.documentId) {
            nomination.mergedDocument = await Document.findOne(dto.documentId);
        }

        // Save details
        if (dto.details) {
            nomination.details = nomination.details ? nomination.details : {};
            nomination.details.redirectionReason = dto.details.redirectionReason;
        }

        statusUpdater.setFinalNomination(nomination);

        this.logger.log({ message: 'Digitally Nominated: ', detail: nominationId, fn: this.digitallyRedirectNomination.name });

        await Log.createAndSave({
            infringement: nomination.infringement,
            account,
            type: LogType.Updated,
            priority: LogPriority.Low,
            message: 'Infringement digitally nominated',
        });

        return nomination;
    }

    private isAlreadyNominated(nomination: Nomination, dto: DigitalRedirectionDto) {
        if (!nomination || !dto) {
            return false;
        }
        if (!nomination.account || !nomination.infringement?.contract) {
            return false;
        }
        return dto.to === NominationTarget.User ? this.isAlreadyNominatedToUser(nomination) : this.isAlreadyNominatedToOwner(nomination);
    }

    private isAlreadyNominatedToUser(nomination: Nomination) {
        const contract = nomination.infringement.contract as LeaseContract;
        return nomination.account.accountId === contract.user?.accountId;
    }

    private isAlreadyNominatedToOwner(nomination: Nomination) {
        return nomination.account.accountId === nomination.infringement.contract.owner?.accountId;
    }

    @Transactional()
    private async findNomination(nominationId: number) {
        const nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();
        if (!nomination) {
            ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId });
        }
        return nomination;
    }

    @Transactional()
    private async findAccount(nomination: Nomination, to: NominationTarget) {
        let account: Account;
        switch (to) {
            case NominationTarget.User:
                account = (nomination.infringement.contract as LeaseContract)?.user;
                break;
            case NominationTarget.Owner:
                account = nomination.infringement.contract?.owner;
                break;
            default:
                break;
        }
        if (!account) {
            throw new BadRequestException({
                message: ERROR_CODES.E162_NoAccountOnInfringementForRedirection.message({
                    to,
                    infringementId: nomination.infringement?.infringementId,
                    nominationId: nomination.nominationId,
                }),
            });
        }
        return account;
    }

    private assertNotBeingRedirected(nomination: Nomination) {
        // Check for the redirection status
        if ([NominationStatus.InRedirectionProcess, NominationStatus.RedirectionCompleted].indexOf(nomination.status) > -1) {
            throw new NominationHasBeenRedirectedException(nomination);
        }

        // Check for the redirection date
        if (!isNil(nomination.redirectedDate)) {
            throw new NominationHasBeenRedirectedException(nomination);
        }

        // Check for the redirection date
        if (!isNil(nomination.redirectionLetterSendDate)) {
            throw new NominationHasBeenRedirectedException(nomination);
        }
    }

    /**
     * Make sure that there is actually a user on the system that can deal with
     * this fine if it is redirected to them.
     *
     * TODO: Determine what we do if we have the account but no users, do we
     *  still redirect the fine?
     *
     * @param accountId The account id that we're verifying (checking there are
     * account users on it)
     * @private
     */
    @Transactional()
    private async assertAccountUsersExist(accountId: number) {
        const userCount = await User.createQueryBuilder('user')
            .leftJoin('user.accounts', 'accountUser')
            .leftJoin('accountUser.account', 'account')
            .andWhere('account.accountId = :accountId', { accountId })
            .andWhere('accountUser.hidden = false')
            .getCount();

        if (userCount === 0) {
            this.logger.warn({
                message: `The account with id ${accountId} does not have an users to see the digital nominations`,
                fn: this.assertAccountUsersExist.name,
            });
        }
    }

    /**
     * If the vehicle isn't linked to the account then we shouldn't be here.
     * @param nomination The nomination that we're looking at
     * @param accountId The account that the vehicle on the nomination that the
     * vehicle should be related to.
     * @private
     */
    @Transactional()
    private async assertVehicleIsRelatedToAccount(nomination: Nomination, accountId: number) {
        const vehicleId = nomination.infringement.vehicle.vehicleId;
        const contractExists = await Vehicle.createQueryBuilder('vehicles')
            .innerJoinAndSelect(Contract, 'contracts', 'contracts."vehicleId" = vehicles."vehicleId"')
            .leftJoin('contracts.user', 'user')
            .leftJoin('contracts.owner', 'owner')
            .where('vehicles.vehicleId = :vehicleId', { vehicleId })
            .andWhere(
                new Brackets((qb) =>
                    qb.where('user.accountId = :accountId', { accountId }).orWhere('user.accountId = :accountId', {
                        accountId,
                    }),
                ),
            )
            .getCount();
        if (contractExists === 0) {
            throw new BadRequestException(ERROR_CODES.E021_VehicleNotRelatedToAccount.message({ vehicleId, accountId }));
        }
    }

    @Transactional()
    async batchDigitallyRedirectNomination(dto: BatchDigitalRedirectionDto) {
        const nominations = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId IN (:...ids)', { ids: dto.nominationIds })
            .getMany();

        const successfulRedirections: Nomination[] = [];
        const failedRedirections: Nomination[] = [];
        for (const nomination of nominations) {
            try {
                const statusUpdater = new StatusUpdater();
                const successfullyRedirected = await this.digitallyRedirectNomination(
                    nomination.nominationId,
                    { to: dto.to },
                    statusUpdater
                        .setInitialNomination(nomination)
                        .setInitialInfringement(nomination.infringement)
                        .setSource(StatusUpdateSources.UpdateInfringement),
                );
                await statusUpdater.resolveStatusUpdates().persist();
                successfulRedirections.push(successfullyRedirected);
            } catch (e) {
                this.logger.error({
                    message: `Failed to perform nomination with error ${e.message}`,
                    fn: this.batchDigitallyRedirectNomination.name,
                });
                failedRedirections.push(nomination);
            }
        }

        return { successfulRedirections, failedRedirections };
    }
}
