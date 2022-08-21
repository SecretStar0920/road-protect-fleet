import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Account, Infringement, Nomination } from '@entities';
import { cloneDeep, get, isNil, omit } from 'lodash';
import * as moment from 'moment';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UpdateRedirectionService } from '@modules/nomination/services/update-redirection.service';
import { UpsertNominationDto } from '@modules/nomination/dtos/upsert-nomination.dto';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { RedirectionParametersService } from '@modules/nomination/services/redirection-parameters.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class UpsertNominationService {
    constructor(
        private logger: Logger,
        private updateRedirectionService: UpdateRedirectionService,
        private redirectionParametersService: RedirectionParametersService,
    ) {}

    @Transactional()
    async createEmptyNomination(infringement: Infringement, statusUpdater: StatusUpdater) {
        const nomination = Nomination.create({
            infringement,
            status: NominationStatus.Acknowledged,
        });
        await nomination.save();
        statusUpdater.setInitialNomination(nomination);
    }

    @Transactional()
    async upsertNomination(dto: UpsertNominationDto, statusUpdater: StatusUpdater): Promise<Nomination> {
        this.logger.debug({ message: 'Updating or creating Nomination', detail: dto, fn: this.upsertNomination.name });

        let account: Account = null;
        try {
            account = await this.tryToGetAccount(dto.accountId, dto.redirectionIdentifier);
        } catch (e) {
            this.logger.warn({
                message: `Failed to find an account during the nomination process ${e.message}`,
                fn: this.upsertNomination.name,
                detail: dto,
            });
        }
        const infringement = await this.checkInfringementRelation(dto.infringementId);

        // Check if the nomination already exists
        const nomination = await Nomination.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :infringementId', { infringementId: infringement.infringementId })
            .getOne();
        const hasNomination = !isNil(nomination);

        let result: Nomination;
        if (hasNomination) {
            // Update
            statusUpdater.setInitialNomination(nomination);
            result = await this.updateExistingNomination(nomination, dto, account, statusUpdater);
        } else {
            // Create
            result = await this.createNewNomination(infringement, dto, account, statusUpdater);
        }

        result = this.redirectionParametersService.setRedirectionParameters(result, dto, account, infringement, statusUpdater);
        statusUpdater.setFinalNomination(result);

        return result;
    }

    @Transactional()
    private async createNewNomination(
        infringement: Infringement,
        dto: UpsertNominationDto,
        account: Account | null,
        statusUpdater: StatusUpdater,
    ) {
        /////////////////////////////////////// CREATE NOMINATION
        this.logger.debug({
            message: 'Nomination does not exist for infringement, creating it',
            detail: dto,
            fn: this.upsertNomination.name,
        });
        let createdNomination = await this.createOnly(dto);

        createdNomination.account = account;
        createdNomination.infringement = infringement;
        createdNomination.type = dto.type;

        createdNomination = await createdNomination.save();

        this.logger.debug({ message: 'Saved Nomination', detail: createdNomination, fn: this.upsertNomination.name });
        statusUpdater.setFinalNomination(createdNomination);
        return createdNomination;
    }

    @Transactional()
    private async updateExistingNomination(
        nomination: Nomination,
        dto: UpsertNominationDto,
        account: Account | null,
        statusUpdater: StatusUpdater,
    ) {
        /////////////////////////////////////// UPDATE NOMINATION
        this.logger.debug({ message: 'Nomination already exists, updating it', detail: dto, fn: this.upsertNomination.name });

        const hasTarget = !!get(nomination, 'redirectionTarget.accountId');

        if (nomination.status === NominationStatus.InRedirectionProcess && hasTarget) {
            // 1. If currently in process of redirection we only allow updates to the nomination target that match what is expected
            this.logger.debug({
                message: 'Updating an infringement that is currently in the process of redirection',
                fn: this.updateExistingNomination.name,
            });
            if (get(nomination, 'redirectionTarget.accountId') === account?.accountId) {
                // Approve the redirection automatically
                nomination = await this.updateRedirectionService.updateRedirectionStatus(nomination.nominationId, { approved: true });
                nomination.type = dto.type;
                await nomination.save();
            } else {
                this.logger.error({
                    message: 'CRITICAL: BRN update on infringement does not match the expected account based on the redirection request',
                    detail: { got: account, expected: nomination.redirectionTarget },
                    fn: this.updateExistingNomination.name,
                });
            }
        } else if (nomination.account?.accountId !== account?.accountId) {
            // 2. If there is a change in nominated account that wasn't triggered from our system allow the redirection on our system
            this.logger.debug({
                message: 'Nomination not already in process, allowing update of nomination target automatically',
                detail: { from: nomination.account, to: account },
                fn: this.updateExistingNomination.name,
            });
            nomination.redirectedFrom = cloneDeep(nomination.account);
            nomination.account = account;
            nomination.type = dto.type;
            // Status is by default acknowledged E
            nomination.status = NominationStatus.Acknowledged;
            await nomination.save();
        }

        statusUpdater.setFinalNomination(nomination); // No updates past this point
        return nomination;
    }

    async createOnly(dto: UpsertNominationDto): Promise<Nomination> {
        this.logger.debug({ message: 'Creating Nomination', detail: dto, fn: this.createOnly.name });
        const nomination = Nomination.create(omit(dto, ['account', 'infringement', 'issuer']));
        nomination.nominationDate = moment().toISOString();

        // // RP-556, remove acknowledgement step by automatically acknowledging and giving full permissions
        nomination.details = {
            acknowledgedFor: {
                redirection: true,
                payment: true,
                appeal: false,
            },
        };
        nomination.status = NominationStatus.Acknowledged;

        this.logger.debug({ message: 'Created Nomination', detail: null, fn: this.createOnly.name });
        return nomination;
    }

    async tryToGetAccount(account: number | null, rawIdentifier: string | null) {
        const byId = account ? await Account.findOneByIdOrNameOrIdentifier(account) : null;
        const byIdentifier = rawIdentifier ? await Account.findOneByIdOrNameOrIdentifier(rawIdentifier) : null;
        return byId ? byId : byIdentifier ? byIdentifier : null;
    }

    async checkAccountRelation(account: number) {
        const foundAccount = await Account.findOneByIdOrNameOrIdentifier(account);

        if (isNil(foundAccount)) {
            throw new BadRequestException({
                message: ERROR_CODES.E141_AccountNotFoundForRedirection.message(),
            });
        }

        return foundAccount;
    }

    async checkInfringementRelation(infringementId: number) {
        const foundInfringement = await Infringement.findWithMinimalRelations()
            .andWhere('infringement.infringementId = :id', { id: infringementId })
            .getOne();

        if (isNil(foundInfringement)) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message() });
        }

        return foundInfringement;
    }
}
