import { Injectable } from '@nestjs/common';
import { ExternalPaymentService } from '@modules/payment/services/external-payment.service';
import { Infringement, InfringementStatus } from '@entities';
import { Promax } from 'promax';
import { Config } from '@config/config';

@Injectable()
export class FixExternalPaymentsService {
    constructor(private externalPaymentService: ExternalPaymentService) {}

    async fix() {
        const infringements = await Infringement.findWithMinimalRelations()
            .where('infringement.status = :status', {
                status: InfringementStatus.Paid,
            })
            .getMany();

        const promax = Promax.create(Config.get.systemPerformance.defaultConcurrentJobs, { throws: false });
        promax.add(infringements.map((inf) => async () => this.externalPaymentService.upsertExternalPayment(inf)));
        await promax.run();
        return promax.getResultMap();
    }
}
