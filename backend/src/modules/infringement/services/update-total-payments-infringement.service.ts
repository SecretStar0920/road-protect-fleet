import { Infringement } from '@entities';
import { Logger } from '@logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { BigNumber } from 'bignumber.js';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class UpdateTotalPaymentsInfringementService {
    constructor(private logger: Logger) {}

    @Transactional()
    async updateInfringementTotalPayment(id: number): Promise<string> {
        const infringement = await Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();
        if (!infringement) {
            throw new BadRequestException({
                message: ERROR_CODES.E037_CouldNotFindInfringement.message({
                    infringementId: id,
                }),
            });
        }
        if (!infringement.payments || infringement.payments.length < 1) {
            infringement.totalPayments = new BigNumber(0).toFixed(2);
        } else {
            const total = infringement.payments.reduce((sum, current) => {
                if (!current.amountPaid) {
                    return sum;
                }
                const amountPaid = current.amountPaid.includes(',') ? current.amountPaid.replace(',', '') : current.amountPaid;
                return new BigNumber(sum).plus(amountPaid).toFixed(2);
            }, '0');
            infringement.totalPayments = new BigNumber(total).toFixed(2);
        }
        try {
            await infringement.save();
            this.logger.debug({
                message: 'Updated Infringement total payments',
                detail: { infringementId: id, totalPayments: infringement.totalPayments },
                fn: this.updateInfringementTotalPayment.name,
            });
            return infringement.totalPayments;
        } catch (error) {
            this.logger.error({
                message: 'Failed to save Infringement with updated total payments',
                detail: { infringementId: id, totalPayments: infringement.totalPayments, error },
                fn: this.updateInfringementTotalPayment.name,
            });
            return infringement.totalPayments;
        }
    }
}
