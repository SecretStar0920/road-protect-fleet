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
import { Logger } from '@logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { VerifyInfringementService } from '@modules/infringement/services/verify-infringement.service';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class UnapproveInfringementForPaymentService {
    constructor(private logger: Logger, private verifyInfringementService: VerifyInfringementService) {}

    async unapproveInfringementForPayment(id: number, identity: IdentityDto): Promise<Infringement> {
        this.logger.log({
            message: `${identity.user?.name} is unapproving the following infringement (id: ${id}) for payment. `,
            detail: { email: identity.user?.email, userId: identity.user?.userId, accountId: identity.accountId },
            fn: this.unapproveInfringementForPayment.name,
        });

        let infringement = await Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();

        if (!infringement) {
            throw new BadRequestException({ message: ERROR_CODES.E037_CouldNotFindInfringement.message({ infringementId: id }) });
        }

        if (infringement.status !== InfringementStatus.ApprovedForPayment) {
            this.logger.warn({
                message: 'Attempted to unapprove an infringement that is not approved',
                detail: null,
                fn: this.unapproveInfringementForPayment.name,
            });
            return infringement;
        }

        await getManager().transaction(async (transaction) => {
            if (infringement.nomination?.status === NominationStatus.Closed) {
                // if nomination is closed, so should the infringement, should it be paid or closed?
                infringement.status = InfringementStatus.Closed;
            } else {
                // check values to determine if infringement should be due or outstanding
                infringement.status = +infringement.penaltyAmount > 0 ? InfringementStatus.Outstanding : InfringementStatus.Due;

                infringement.approvedDate = null;
            }
            infringement = await transaction.save(infringement);
        });

        const account = await Account.findByIdentifierOrId(identity.accountId.toString());

        await InfringementApproval.createAndSave({
            infringement,
            user: identity.user,
            account: account || null,
            action: InfringementApprovalAction.Unapprove,
        });

        this.logger.log({
            message: 'Unapproved Infringement: ',
            detail: infringement,
            fn: this.unapproveInfringementForPayment.name,
        });

        await Log.createAndSave({
            infringement,
            type: LogType.Updated,
            priority: LogPriority.High,
            message: 'Infringement unapproved for payment',
        });

        try {
            await this.verifyInfringementService.verifySingle(infringement.infringementId);
        } catch (e) {
            this.logger.log({
                message: 'Could not verify infringement on unapproval',
                detail: infringement.infringementId,
                fn: this.unapproveInfringementForPayment.name,
            });
        }
        return Infringement.findWithMinimalRelations().andWhere('infringement.infringementId = :id', { id }).getOne();
    }
}
