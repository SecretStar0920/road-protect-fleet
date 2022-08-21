import { Injectable } from '@nestjs/common';
import { Account, Infringement, Nomination, RedirectionType } from '@entities';
import { StatusUpdater } from '@modules/infringement/helpers/status-updater/status-updater';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { isNil } from 'lodash';
import { CannotRedirectToOwnerException } from '@modules/nomination/exceptions/cannot-redirect-to-owner.exception';
import { CannotCompleteRedirectionWhenIdentifierDoesNotMatchException } from '@modules/nomination/exceptions/cannot-complete-redirection-when-identifier-does-not-match.exception';
import { NominationStatus } from '@modules/shared/models/nomination-status';

export interface RedirectionParameters {
    setRedirectionIdentifier?: boolean;
    setRedirectionCompletionDate?: boolean;
    redirectionIdentifier?: string;
    redirectionReference?: string;
    redirectionLetterSendDate?: string;
    redirectionCompletionDate?: string;
}

@Injectable()
export class RedirectionParametersService {
    setRedirectionParameters(
        nomination: Nomination,
        nominationDto: RedirectionParameters,
        account: Account | null,
        infringement: Infringement,
        statusUpdater: StatusUpdater,
    ) {
        const finalIdentifier = nominationDto.setRedirectionIdentifier
            ? nominationDto?.redirectionIdentifier || account?.identifier
            : false;

        if (nominationDto.setRedirectionIdentifier) {
            if (nominationDto.redirectionIdentifier && nominationDto.redirectionIdentifier === infringement.contract?.owner?.identifier) {
                throw new CannotRedirectToOwnerException(infringement, nominationDto.redirectionIdentifier);
            }
            nomination.rawRedirectionIdentifier = finalIdentifier || nomination.rawRedirectionIdentifier;
            nomination.externalRedirectionReference = nominationDto.redirectionReference || nomination.externalRedirectionReference;
            nomination.redirectionTarget = account;
        }

        if (!!nominationDto.redirectionLetterSendDate) {
            nomination.redirectionLetterSendDate = nominationDto.redirectionLetterSendDate;
            nomination.rawRedirectionIdentifier = finalIdentifier || nomination.rawRedirectionIdentifier;
        }

        // Only set redirection completion date if it is a valid redirection or if the setRedirectionCompletionDate is true
        if (
            !!nominationDto.redirectionCompletionDate &&
            (this.isValidRedirection(nomination, nominationDto, infringement) || nominationDto.setRedirectionCompletionDate)
        ) {
            // Check to see if the validation has valid parameters, otherwise throw an exception
            nomination.redirectedDate = nominationDto.redirectionCompletionDate;
            nomination.rawRedirectionIdentifier = finalIdentifier || nomination.rawRedirectionIdentifier;
        }

        if (this.isValidRedirectionInProcess(nomination, nominationDto, infringement)) {
            // We only do this if it was an internal change
            if (nomination.redirectionType !== RedirectionType.External) {
                nomination.status = NominationStatus.InRedirectionProcess;
                statusUpdater.setForceIssuerStatus(NominationStatus.InRedirectionProcess);
            }
        }

        // It's only a valid redirection if the raw redirection identifier on
        //  the nomination is equal to the redirection identifier on the system
        if (this.isValidRedirection(nomination, nominationDto, infringement)) {
            nomination.status = NominationStatus.RedirectionCompleted;
            statusUpdater.setForceIssuerStatus(NominationStatus.RedirectionCompleted);
        }

        return nomination;
    }

    private isValidRedirectionInProcess(nomination: Nomination, nominationDto: NominationDto, infringement: Infringement) {
        // Ideal case
        if (nomination.rawRedirectionIdentifier && infringement.brn !== nomination.rawRedirectionIdentifier) {
            return true;
        }

        const justCreated =
            isNil(nomination.rawRedirectionIdentifier) ||
            (nominationDto.redirectionIdentifier === nomination.rawRedirectionIdentifier && nominationDto.redirectionIdentifier);

        // Completely new
        return (
            justCreated &&
            nominationDto.setRedirectionIdentifier &&
            nominationDto.redirectionIdentifier &&
            nominationDto.redirectionIdentifier !== infringement.brn
        );
    }

    private isValidRedirection(nomination: Nomination, nominationDto: NominationDto, infringement: Infringement) {
        // Ideal case
        if (nomination.rawRedirectionIdentifier && nomination.rawRedirectionIdentifier === infringement.brn) {
            return true;
        }

        const justCreated =
            isNil(nomination.rawRedirectionIdentifier) ||
            (nominationDto.redirectionIdentifier === nomination.rawRedirectionIdentifier && nominationDto.redirectionIdentifier);

        // Completely new
        return (
            justCreated &&
            nominationDto.setRedirectionIdentifier &&
            nominationDto.redirectionIdentifier &&
            infringement.brn === nominationDto.redirectionIdentifier
        );
    }
}
