import { BadRequestException, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { Logger } from '@logger';
import { Nomination } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { UpdateRedirectionStatusDto } from '@modules/nomination/dtos/update-redirection-status.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class UpdateRedirectionService {
    constructor(private logger: Logger) {}

    @Transactional()
    async updateRedirectionStatus(nominationId: number, dto: UpdateRedirectionStatusDto): Promise<Nomination> {
        this.logger.debug({ message: 'Updating redirection status', detail: dto, fn: this.updateRedirectionStatus.name });
        let nomination = await Nomination.findWithMinimalRelations()
            .where('nomination.nominationId = :nominationId', { nominationId })
            .getOne();

        if (isNil(nomination)) {
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message() });
        }

        if (nomination.status !== NominationStatus.InRedirectionProcess) {
            throw new BadRequestException({
                message: ERROR_CODES.E091_NotInRedirectionProcessCannotBeApprovedOrDenied.message(),
            });
        }

        if (dto.approved) {
            // If it's approved we can change the nominated account and reset the target
            nomination.account = nomination.redirectionTarget;
            nomination.redirectionTarget = null;
            // F
            nomination.status = NominationStatus.Acknowledged;
        } else {
            nomination.redirectionTarget = null;
            // F
            nomination.status = NominationStatus.Acknowledged;
            nomination.redirectedFrom = null;
            // Reset documents so that they can be recreated with valid information
            nomination.redirectionDocument = null;
            nomination.mergedDocument = null;
        }

        nomination = await nomination.save();

        this.logger.debug({ message: 'Updated redirection status', detail: nomination, fn: this.updateRedirectionStatus.name });

        return nomination;
    }
}
