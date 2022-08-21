import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import {
    Account,
    Infringement,
    InfringementApproval,
    InfringementApprovalAction,
    InfringementStatus,
    Log,
    LogPriority,
    LogType,
} from '@entities';
import { getManager } from 'typeorm';
import * as moment from 'moment';
import { BatchApproveInfringementDto } from '@modules/infringement/dtos/batch-approve-infringement.dto';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class ApproveInfringementForPaymentService {
    constructor(private logger: Logger) {}

    async approveInfringementForPayment(id: number, identity: IdentityDto): Promise<Infringement> {
        this.logger.log({
            message: `${identity.user?.name} is approving the following infringement (id: ${id}) for payment. `,
            detail: { email: identity.user?.email, userId: identity.user?.userId, accountId: identity.accountId },
            fn: this.approveInfringementForPayment.name,
        });

        let infringement = await Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();

        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: id }) });
        }

        if (infringement.status === InfringementStatus.Closed || infringement.status === InfringementStatus.Paid) {
            this.logger.warn({
                message: 'Attempted to approve a closed/paid infringement.',
                detail: infringement.status,
                fn: this.approveInfringementForPayment.name,
            });
            return infringement;
        }

        if (infringement.status === InfringementStatus.ApprovedForPayment) {
            this.logger.warn({
                message: 'Attempted to approve a infringement that is already approved',
                detail: null,
                fn: this.approveInfringementForPayment.name,
            });
            return infringement;
        }

        await getManager().transaction(async (transaction) => {
            infringement.status = InfringementStatus.ApprovedForPayment;
            infringement.approvedDate = moment().toISOString();

            infringement = await transaction.save(infringement);
        });

        const account = await Account.findByIdentifierOrId(identity.accountId.toString());

        await InfringementApproval.createAndSave({
            infringement,
            user: identity.user,
            account: account || null,
            action: InfringementApprovalAction.Approve,
        });

        this.logger.log({
            message: 'Approved Infringement: ',
            detail: infringement,
            fn: this.approveInfringementForPayment.name,
        });

        await Log.createAndSave({
            infringement,
            type: LogType.Updated,
            priority: LogPriority.High,
            message: 'Infringement approved for payment',
        });

        return Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();
    }

    async batchApproveInfringementForPayment(dto: BatchApproveInfringementDto, identity: IdentityDto): Promise<Infringement[]> {
        const approvedInfringements: Infringement[] = [];
        const failedApprovals = [];
        for (const id of dto.infringementIds) {
            try {
                const infringement = await this.approveInfringementForPayment(id, identity);
                approvedInfringements.push(infringement);
            } catch (e) {
                failedApprovals.push(id);
                this.logger.warn({
                    message: 'Failed to approve a infringement',
                    detail: {
                        error: e.message,
                        stack: e.stack,
                    },
                    fn: this.batchApproveInfringementForPayment.name,
                });
            }
        }

        return approvedInfringements;
    }
}
