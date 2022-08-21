import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement, IntegrationPaymentStatus } from '@entities';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetInfringementService {
    constructor(private logger: Logger, private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService) {}

    async getInfringement(infringementId: number): Promise<Infringement> {
        this.logger.log({ message: `Getting Infringement with id: `, detail: infringementId, fn: this.getInfringement.name });
        const infringement = await Infringement.findWithMinimalRelationsAndAccounts()
            .andWhere('infringement.infringementId = :infringementId', { infringementId })
            .orderBy('payment."paymentDate"', 'DESC')
            .getOne();

        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId }) });
        }

        if (!infringement.totalPayments) {
            infringement.totalPayments = await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(infringementId);
        }

        this.logger.log({ message: `Found Infringement with id: `, detail: infringement.infringementId, fn: this.getInfringement.name });
        return infringement;
    }
}
