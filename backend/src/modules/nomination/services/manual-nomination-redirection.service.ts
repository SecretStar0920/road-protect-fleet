import { Injectable } from '@nestjs/common';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { Account, Infringement, Log, LogPriority, LogType, Nomination, NominationType, RedirectionType } from '@entities';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { Logger } from '@logger';
import { UpsertNominationService } from '@modules/nomination/services/upsert-nomination.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { isNil } from 'lodash';
import * as moment from 'moment';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export interface ManualRedirectionResult {
    success: boolean;
    message?: string;
    error?: boolean;
}

@Injectable()
export class ManualNominationRedirectionService {
    constructor(private logger: Logger, private upsertNominationService: UpsertNominationService) {}

    shouldRedirect(dto: NominationDto, nomination: Nomination) {
        const isNewRedirection = !!dto?.redirectionIdentifier && !!dto?.redirectionLetterSendDate;
        const isCompleteRedirection = !!dto?.redirectionCompletionDate;
        const isCompleteWithHistory =
            !!dto?.redirectionCompletionDate &&
            !!nomination?.rawRedirectionIdentifier &&
            nomination?.status === NominationStatus.InRedirectionProcess;
        const isAdminOverride = !!dto?.redirectionIdentifier && dto?.setRedirectionIdentifier;
        const isAdminReferenceOverride = !!dto?.redirectionReference && dto?.setRedirectionIdentifier;

        return isNewRedirection || isCompleteRedirection || isCompleteWithHistory || isAdminOverride || isAdminReferenceOverride;
    }

    @Transactional()
    async redirect(infringement: Infringement, statusUpdater: StatusUpdater, dto: NominationDto): Promise<ManualRedirectionResult> {
        if (!dto) {
            return {
                success: false,
                error: true,
                message: 'The nomination dto is not defined',
            };
        }
        // Just add an empty nomination if one doesn't exist and we'll modify this as
        // we work through the logic
        infringement.nomination = !infringement.nomination ? Nomination.create() : infringement.nomination;
        if (!this.shouldRedirect(dto, infringement.nomination)) {
            return {
                success: false,
                error: false,
                message: 'The nomination dto is not a valid redirection target',
            };
        }

        if (this.isRedirectingToCurrentBrn(infringement, dto)) {
            return {
                success: false,
                error: true,
                message: `The redirection is targeted to the current BRN that owns the infringement, so a redirection should not take place.`,
            };
        }

        if (this.isRedirectingToOwner(infringement, dto)) {
            return {
                success: false,
                error: true,
                message: `The infringement is being redirected to the owner of the vehicle, this is currently not supported since that usually means there is an error (direction is incorrect).`,
            };
        }

        if (this.isCompletingRedirectionWithNoIdentifier(infringement.nomination, dto)) {
            return {
                success: false,
                error: true,
                message: `The redirection is "complete" but there was never an identifier (BRN) specified.`,
            };
        }

        if (this.isRedirectingToIncorrectAccount(infringement.nomination, dto)) {
            return this.updateInvalidRedirection(infringement, dto, statusUpdater);
        }

        // I want to skip this if the set flag is set to true. This is because
        //  we may be updating other information like the redirection reference
        if (this.isAlreadyRedirecting(infringement.nomination, dto) && !dto.setRedirectionIdentifier) {
            return {
                success: false,
                error: false,
                message: `The redirection is already taking place.`,
            };
        }

        if (this.isAlreadyRedirected(infringement, infringement.nomination, dto) && !dto.setRedirectionIdentifier) {
            return {
                success: false,
                error: false,
                message: `The redirection is already complete.`,
            };
        }

        const account = await Account.findByIdentifierOrId(dto.redirectionIdentifier);

        const nominationData: any = {
            ...dto,
            infringementId: infringement.infringementId,
            accountId: account ? account?.accountId : null,
            type: NominationType.Municipal,
            redirectionType: this.calculateRedirectionType(infringement.nomination, dto),
        };

        if (!account) {
            this.logger.log({
                message: `Redirecting the infringement to an account that IS NOT on the system.`,
                fn: this.redirect.name,
                detail: {
                    infringementId: infringement.infringementId,
                    dto,
                },
            });
        } else {
            this.logger.log({
                message: `Redirecting the infringement to an account IS on the system.`,
                fn: this.redirect.name,
                detail: {
                    infringementId: infringement.infringementId,
                    account,
                    dto,
                },
            });
        }

        const nomination = await this.upsertNominationService.upsertNomination(nominationData, statusUpdater);
        statusUpdater.setFinalInfringement(infringement);
        const redirectionReasonAccount = account ? `${account.name} (${account.identifier})` : `${dto.redirectionIdentifier}`;
        nomination.details.redirectionReason = `Redirected to ${redirectionReasonAccount}${
            dto.redirectionType ? ' (' + dto.redirectionType + ')' : ''
        }`;

        this.logger.debug({
            message: `Completed the nomination with a manual redirection`,
            detail: nomination,
            fn: this.redirect.name,
        });

        return {
            success: true,
            message: nomination.details.redirectionReason,
        };
    }

    /**
     * See if we're redirecting to the BRN that is saved on the infringement.
     * @param infringement
     * @param dto
     * @private
     */
    private isRedirectingToCurrentBrn(infringement: Infringement, dto: NominationDto) {
        if (dto.previousBrn && dto.previousBrn !== (infringement.brn || '').toString()) {
            // If the previous BRN saved in the nomination dto is different to the one on
            // the infringement then it means that we've updated the infringement and we
            // now need to update the nomination so this should not return "true" when
            // we ask if it's redirecting to itself.
            return false;
        }
        return (infringement.brn || '').toString() === (dto.redirectionIdentifier || '').toString();
    }

    /**
     * See if we're redirecting to the contract owner BRN
     * @param infringement
     * @param dto
     * @private
     */
    private isRedirectingToOwner(infringement: Infringement, dto: NominationDto) {
        return (
            !isNil(infringement.contract?.owner?.identifier) &&
            !isNil(dto?.redirectionIdentifier) &&
            (infringement.contract?.owner?.identifier || '').toString() === (dto.redirectionIdentifier || '').toString()
        );
    }

    /**
     * This only happens when the nomination already has an identifier set and we're
     * about to perform a redirection action to a new brn
     * @param nomination
     * @param dto
     * @private
     */
    private isRedirectingToIncorrectAccount(nomination: Nomination, dto: NominationDto) {
        if (isNil(nomination.rawRedirectionIdentifier) || isNil(dto.redirectionIdentifier)) {
            return false;
        }
        // The admin may be resetting the target BRN
        if (dto.setRedirectionIdentifier) {
            return false;
        }
        return nomination.rawRedirectionIdentifier.toString() !== dto.redirectionIdentifier.toString();
    }

    /**
     * Check if we're trying to say that the redirection is complete but we had never
     * received the identifier.
     * @param nomination
     * @param dto
     * @private
     */
    private isCompletingRedirectionWithNoIdentifier(nomination: Nomination, dto: NominationDto) {
        return dto.redirectionCompletionDate && !dto.redirectionIdentifier && !nomination.rawRedirectionIdentifier;
    }

    /**
     * Check if we're trying to start a redirection but it's already happening
     * AND it's the exact same data.
     * @param nomination
     * @param dto
     * @private
     */
    private isAlreadyRedirecting(nomination: Nomination, dto: NominationDto) {
        if (!!dto.redirectionCompletionDate) {
            // There's more in the dto than just the letter send date (ie the
            // intention is to do more than the send date).
            return false;
        }
        if (!dto.redirectionIdentifier || !dto.redirectionLetterSendDate) {
            return false;
        }
        // At this point we know that there is a letter send date and identifier
        return (
            nomination.rawRedirectionIdentifier === dto.redirectionIdentifier &&
            nomination.redirectionLetterSendDate !== null &&
            moment(nomination.redirectionLetterSendDate).isSame(moment(dto.redirectionLetterSendDate))
        );
    }

    /**
     * Check if this dto is a redirection dto and if the redirection itself is
     * already done. We assume at this point that the identifier is correct or
     * left empty, so we just check that there is one on the nomination and the
     * completion date is equal.
     * @param infringement
     * @param nomination
     * @param dto
     * @private
     */
    private isAlreadyRedirected(infringement: Infringement, nomination: Nomination, dto: NominationDto) {
        return (
            nomination.rawRedirectionIdentifier !== null &&
            infringement.brn === nomination.rawRedirectionIdentifier &&
            dto.redirectionCompletionDate !== null &&
            moment(nomination.redirectedDate).isSame(dto.redirectionCompletionDate)
        );
    }

    /**
     * If a redirection is invalid (ie. we're trying to set the BRN to one that was not
     * set in the rawRedirectionIdentifier), we flag it as invalid and return that the
     * redirection failed.
     * @param infringement
     * @param statusUpdater
     * @private
     */
    private async updateInvalidRedirection(infringement: Infringement, dto: any, statusUpdater: StatusUpdater) {
        await Log.createAndSave({
            type: LogType.Error,
            infringement,
            priority: LogPriority.High,
            message: `An attempt was made to redirect the infringement to a BRN that was not requested internally ${dto.redirectionIdentifier} vs ${infringement.nomination.rawRedirectionIdentifier}`,
        });
        statusUpdater.setInitialNomination(infringement.nomination);
        await statusUpdater.setFinalNomination(infringement.nomination).persist();
        return {
            success: false,
            error: true,
            message: `An attempt was made to redirect the infringement to a BRN that was not requested internally ${dto.redirectionIdentifier} vs ${infringement.nomination.rawRedirectionIdentifier}, the invalid redirection flag has been set.`,
        };
    }

    /**
     * Apply specific rules to the transition of the redirection type. You cannot move from
     * anything to external but you can move from external to anything.
     * @param nomination The nomination that currently exists
     * @param dto The dto being used to determine the redirection
     * @private
     */
    private calculateRedirectionType(nomination: Nomination, dto: NominationDto): RedirectionType {
        if (!!dto.redirectionType && !nomination.redirectionType) {
            return dto.redirectionType;
        }
        if (!dto.redirectionType) {
            return nomination.redirectionType;
        }
        if (nomination.redirectionType !== RedirectionType.External && dto.redirectionType === RedirectionType.External) {
            return nomination.redirectionType;
        }
        if (nomination.redirectionType !== RedirectionType.External && dto.redirectionType !== RedirectionType.External) {
            return dto.redirectionType;
        }
        return dto.redirectionType;
    }
}
