import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import {
    Account,
    Contract,
    ContractType,
    Infringement,
    LeaseContract,
    Log,
    LogPriority,
    LogType,
    Nomination,
    NominationTarget,
    NominationType,
    Vehicle,
} from '@entities';
import { isNil } from 'lodash';
import { UpsertNominationService } from '@modules/nomination/services/upsert-nomination.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { DigitallyRedirectNominationService } from '@modules/nomination/services/digitally-redirect-nomination.service';
import { FeatureFlagHelper } from '@modules/shared/modules/feature-flag/helpers/feature-flag.helper';
import { ManualNominationRedirectionService } from '@modules/nomination/services/manual-nomination-redirection.service';
import * as moment from 'moment';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class AutomaticNominationService {
    constructor(
        private logger: Logger,
        private upsertNominationService: UpsertNominationService,
        private digitallyRedirectNominationService: DigitallyRedirectNominationService,
        private manualNominationRedirectionService: ManualNominationRedirectionService,
    ) {}

    /**
     * This function decides based on an existing infringement and the linked vehicle, which account should be the nominated target (i.e responsible for action)
     */
    @Transactional()
    async nominateInfringement(infringement: Infringement, statusUpdater: StatusUpdater, nominationDto: NominationDto = {}) {
        /**
         * Look to see if there are any redirections that have been specified in
         * the nomination dto. If this is the case, we take this as the source
         * of truth and redirect to where ever specified and end the process
         * here.
         */
        try {
            if (await this.manuallyNominateByDto(infringement, statusUpdater, nominationDto)) {
                return;
            }
        } catch (e) {
            this.logger.error({
                message: `Failed to manually redirect the nomination: ${e.message}`,
                fn: this.nominateInfringement.name,
                detail: {
                    infringement,
                    nominationDto,
                    error: e.message,
                },
            });
            return;
        }

        /**
         * We then look to see if there are any nominations that we can do using
         * the contract
         */
        try {
            await this.digitallyNominateByContract(infringement, statusUpdater);
        } catch (e) {
            this.logger.error({
                message: `Failed to nominate the contract correctly: ${e.message}`,
                fn: this.nominateInfringement.name,
                detail: {
                    infringement,
                    nominationDto,
                    error: e.message,
                },
            });
        }
    }

    @Transactional()
    async manuallyNominateByDto(infringement: Infringement, statusUpdater: StatusUpdater, nominationDto: NominationDto): Promise<boolean> {
        if (!this.manualNominationRedirectionService.shouldRedirect(nominationDto, infringement.nomination)) {
            return false;
        }
        this.logger.log({
            message: 'Manually redirecting an infringement via the Nomination dto',
            detail: { infringementId: infringement.infringementId, nominationDto },
            fn: this.manuallyNominateByDto.name,
        });

        const redirectionResult = await this.manualNominationRedirectionService.redirect(infringement, statusUpdater, nominationDto);
        if (!redirectionResult.success) {
            this.logger.warn({
                message: `Failed to manually redirect the nomination to the new Nomination dto: ${redirectionResult.message}`,
                detail: { infringementId: infringement.infringementId, nominationDto },
                fn: this.manuallyNominateByDto.name,
            });
            return false;
        }

        await Log.createAndSave({
            infringement,
            vehicle: infringement.vehicle,
            type: LogType.Updated,
            priority: LogPriority.High,
            message: `Manually redirected infringement to identifier ${nominationDto.redirectionIdentifier}`,
        });

        return true;
    }

    @Transactional()
    async defaultNomination(infringement: Infringement, statusUpdater: StatusUpdater) {
        this.logger.log({
            message: 'Digitally nominating an infringement via contract: ',
            detail: { infringementId: infringement.infringementId },
            fn: this.digitallyNominateByContract.name,
        });
        const contract = infringement.contract;
        const vehicle = infringement.vehicle;
        if (isNil(contract)) {
            if (infringement.brn) {
                await this.municipallyNominateByInfringementBRN(infringement, statusUpdater, {});
            } else {
                await Log.createAndSave({
                    infringement,
                    vehicle,
                    type: LogType.Warning,
                    priority: LogPriority.High,
                    message: `Cannot nominate the infringement to an account since this infringement was not linked to a valid contract and did not have an explicit BRN`,
                });
                await this.upsertNominationService.createEmptyNomination(infringement, statusUpdater);
            }
        }
        const { account, nomination } = await this.findOrCreateNomination(infringement, contract, vehicle, statusUpdater);
        return { account, nomination, contract };
    }

    @Transactional()
    async digitallyNominateByContract(infringement: Infringement, statusUpdater: StatusUpdater) {
        const { account, nomination, contract } = await this.defaultNomination(infringement, statusUpdater);
        if (
            await FeatureFlagHelper.isEnabled({
                title: 'automated-digital-nominations',
                defaultEnabled: false,
                disabledMessage: 'Automated digital nominations is not enabled',
            })
        ) {
            // We want to make sure that any changes to this point are saved
            // before digitally nominating the infringements.
            await statusUpdater.persist();
            const leaseContract = contract as LeaseContract;
            // Check if there is a lease holder and if the account id is not the
            // same as the owner of the vehicle (technically that should never be
            // the case)
            if (
                leaseContract?.user?.accountId &&
                leaseContract?.user?.accountId !== account.accountId &&
                nomination.status !== NominationStatus.InRedirectionProcess &&
                nomination.status !== NominationStatus.RedirectionCompleted
            ) {
                await this.digitallyRedirectNominationService.digitallyRedirectNomination(
                    nomination.nominationId,
                    {
                        to: NominationTarget.User,
                        details: {
                            ...nomination.details,
                            redirectionReason: `Automated digital nomination during creation from ${account.accountId} to ${leaseContract.user.accountId}`,
                        },
                    },
                    statusUpdater,
                );
            }
        }
    }

    @Transactional()
    async municipallyNominateByInfringementBRN(infringement: Infringement, statusUpdater: StatusUpdater, nominationDto: NominationDto) {
        this.logger.log({
            message: `Municipally nominating an infringement via the infringement BRN: ${infringement.brn}`,
            detail: {
                infringementId: infringement.infringementId,
                brn: infringement.brn,
                noticeNumber: infringement.noticeNumber,
            },
            fn: this.municipallyNominateByInfringementBRN.name,
        });

        // Try find the account as specified by the BRN on the infringement
        const account: Account = await Account.findByIdentifierOrId(infringement.brn);

        // If not found, log an error
        if (isNil(account)) {
            this.logger.warn({
                message: `Failed to automatically municipally nominate the infringement since the BRN on this infringement (${infringement.brn}) is not a valid account on the system`,
                fn: this.municipallyNominateByInfringementBRN.name,
            });
            await Log.createAndSave({
                infringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: `Failed to automatically municipally nominate the infringement since the BRN on this infringement (${infringement.brn}) is not a valid account on the system`,
            });
        }

        const dto: any = {
            ...nominationDto,
            infringementId: infringement.infringementId,
            type: NominationType.Municipal,
        };

        if (account) {
            dto.accountId = account.accountId;
        } else {
            dto.redirectionIdentifier = infringement.brn;
            dto.redirectionCompletionDate = moment().toISOString();
            await Log.createAndSave({
                infringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: `Setting a manual redirection since the BRN ${infringement.brn} was not found on the system.`,
            });
        }

        // If found, create the municipal nomination
        await this.upsertNominationService.upsertNomination(
            {
                ...nominationDto,
                infringementId: infringement.infringementId,
                accountId: account.accountId,
                type: NominationType.Municipal,
            },
            statusUpdater,
        );
        await Log.createAndSave({
            infringement,
            account,
            type: LogType.Created,
            priority: LogPriority.Low,
            message: `Infringement has been nominated directly to the BRN provided on the infringement upload / update`,
        });
    }

    private async findOrCreateNomination(infringement: Infringement, contract: Contract, vehicle: Vehicle, statusUpdater: StatusUpdater) {
        const existingNomination = await Nomination.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :infringementId', { infringementId: infringement.infringementId })
            .getOne();
        const account: Account = contract.owner;

        if (
            existingNomination &&
            contract.type === ContractType.Lease &&
            existingNomination.account.accountId === (contract as LeaseContract)?.user?.accountId
        ) {
            return {
                nomination: existingNomination,
                account,
            };
        }

        // NB: the default digital nomination by contract is always the OWNER
        const nomination = await this.upsertNominationService.upsertNomination(
            {
                infringementId: infringement.infringementId,
                accountId: account.accountId,
                type: NominationType.Digital,
            },
            statusUpdater,
        );

        await Log.createAndSave({
            infringement,
            vehicle,
            account,
            type: LogType.Created,
            priority: LogPriority.Low,
            message: `Infringement has been automatically digitally nominated to the Owner based on the contract`,
        });
        return { nomination, account };
    }
}
