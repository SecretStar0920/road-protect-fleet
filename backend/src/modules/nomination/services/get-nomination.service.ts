import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Nomination } from '@entities';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetNominationService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    async getNomination(nominationId: number): Promise<Nomination> {
        this.logger.log({ message: `Getting Nomination with id: `, detail: nominationId, fn: this.getNomination.name });
        const nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();

        if (!nomination) {
            throw new BadRequestException(ERROR_CODES.E020_CouldNotFindNomination.message({ nominationId }));
        }

        if (!nomination.infringement.totalPayments) {
            nomination.infringement.totalPayments = await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(
                nomination.infringement.infringementId,
            );
        }

        this.logger.log({ message: `Found Nomination with id: `, detail: nomination.nominationId, fn: this.getNomination.name });
        return nomination;
    }
}
