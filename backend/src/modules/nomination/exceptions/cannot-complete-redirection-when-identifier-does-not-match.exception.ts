import { Infringement } from '@entities';

export class CannotCompleteRedirectionWhenIdentifierDoesNotMatchException extends Error {
    constructor(infringement: Infringement, identifier: string, completionDate: string) {
        super(
            `You cannot specify the redirection completion (${completionDate}) when the identifier (${identifier}) does not match the BRN from the issuer (${infringement.brn})`,
        );
    }
}
