import { BadRequestException } from '@nestjs/common';
import { Nomination } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class NominationHasBeenRedirectedException extends BadRequestException {
    constructor(public nomination: Nomination) {
        super(ERROR_CODES.E127_NominationHasBeenRedirected.message({ nominationId: nomination.nominationId }));
    }
}
