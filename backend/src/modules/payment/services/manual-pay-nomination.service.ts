import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { InfringementLog, InfringementStatus, Log, LogPriority, LogType, Nomination } from '@entities';
import * as moment from 'moment';
import { CreateManualPaymentService } from '@modules/payment/modules/manual-payment/services/create-manual-payment.service';
import { isNil } from 'lodash';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ManualPayNominationDto } from '@modules/payment/dtos/manual-pay-nomination.dto';
import { UpdateTotalPaymentsInfringementService } from '@modules/infringement/services/update-total-payments-infringement.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class ManualPayNominationService {
    constructor(
        private logger: Logger,
        private createManualPaymentService: CreateManualPaymentService,
        private updateTotalPaymentsInfringementService: UpdateTotalPaymentsInfringementService,
    ) {}

    @Transactional()
    async manualPayNomination(nominationId: number, dto: ManualPayNominationDto): Promise<Nomination> {
        this.logger.log({ message: 'Manual payment of Nomination: ', detail: nominationId, fn: this.manualPayNomination.name });
        let nomination = await Nomination.findWithMinimalRelations()
            .andWhere('nomination.nominationId = :nominationId', { nominationId })
            .getOne();

        if (nomination.status === NominationStatus.Closed) {
            throw new BadRequestException({ message: ERROR_CODES.E149_NominationHAsAlreadyBeenPaid.message() });
        }

        if (isNil(nomination)) {
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message() });
        }

        const payment = await this.createManualPaymentService.createOnly({
            infringementId: nomination.infringement.infringementId,
            ...dto,
        });

        const infringementOriginalStatus = nomination.infringement.status;

        nomination.status = NominationStatus.Closed;
        nomination.paidDate = moment().toISOString();
        nomination.infringement.status = InfringementStatus.Paid;

        await nomination.infringement.save();
        await payment.save();
        nomination.infringement.payments.push(payment);
        nomination = await nomination.save();

        // Update total payments
        nomination.infringement.totalPayments = await this.updateTotalPaymentsInfringementService.updateInfringementTotalPayment(
            payment.infringement.infringementId,
        );

        await InfringementLog.createAndSave({
            oldStatus: infringementOriginalStatus,
            newStatus: InfringementStatus.Paid,
            data: nomination.infringement,
            infringement: nomination.infringement,
        });

        await Log.createAndSave({
            infringement: nomination.infringement,
            type: LogType.Updated,
            message: 'Infringement paid manually',
            priority: LogPriority.High,
        });

        this.logger.log({ message: 'Manually paid Nomination: ', detail: nominationId, fn: this.manualPayNomination.name });
        return nomination;
    }
}
