import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ManualPayment } from '@entities';

@Injectable()
export class GetManualPaymentsService {
    constructor(private logger: Logger) {}

    async get(): Promise<ManualPayment[]> {
        this.logger.log({ message: `Getting Manual Payments`, detail: null, fn: this.get.name });
        const manualPayments = await ManualPayment.createQueryBuilder('manualPayment').getMany();
        this.logger.log({ message: `Found Manual Payments, length: `, detail: manualPayments.length, fn: this.get.name });
        return manualPayments;
    }
}
