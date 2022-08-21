import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Payment } from '@entities';
import { Promax } from 'promax';
import { Config } from '@config/config';
import { extractAtgPaymentReference } from '@modules/payment/helpers/atg-payment-reference-extractor';

@Injectable()
export class FixPaymentReferencesService {
    constructor(private logger: Logger) {}

    async fix() {
        this.logger.log({
            fn: this.fix.name,
            message: 'Running the payment reference fix',
        });
        const payments = await Payment.createQueryBuilder('payment').getMany();
        this.logger.debug({
            fn: this.fix.name,
            message: `Found ${payments.length} payments to run through`,
        });
        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, {
            throws: false,
        });
        promax.add(payments.map((payment) => async () => this.updateReference(payment)));
        await promax.run();
        return promax.getResultMap();
    }

    private async updateReference(payment: Payment) {
        if (payment.externalReference) {
            return;
        }
        const reference = extractAtgPaymentReference(payment);
        if (reference) {
            payment.externalReference = reference;
            await payment.save();
            return payment;
        }
    }
}
