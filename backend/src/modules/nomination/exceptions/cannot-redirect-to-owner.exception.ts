import { Infringement } from '@entities';

export class CannotRedirectToOwnerException extends Error {
    constructor(infringement: Infringement, identifier: string) {
        super(
            `Cannot redirect infringement with notice number ${infringement.noticeNumber} to ${identifier} because this is the vehicle owner.`,
        );
    }
}
