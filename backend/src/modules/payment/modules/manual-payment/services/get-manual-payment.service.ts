import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ManualPayment } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetManualPaymentService {
    constructor(private logger: Logger) {}

    async get(manualPaymentId: number): Promise<ManualPayment> {
        this.logger.log({ message: `Getting ManualPayment with id: `, detail: manualPaymentId, fn: this.get.name });
        const manualPayment = await ManualPayment.createQueryBuilder('manualPayment')
            .andWhere('manualPayment.manualPaymentId = :id', { id: manualPaymentId })
            .getOne();
        if (!manualPayment) {
            throw new BadRequestException({ message: ERROR_CODES.E145_CouldNotFindManualPayment.message({ manualPaymentId }) });
        }
        this.logger.log({ message: `Found ManualPayment with id: `, detail: manualPayment.paymentId, fn: this.get.name });
        return manualPayment;
    }
}
