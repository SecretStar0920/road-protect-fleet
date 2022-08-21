import { Injectable } from '@nestjs/common';
import { Infringement, InfringementLog, InfringementStatus, Log, LogPriority, LogType } from '@entities';
import { isEmpty } from 'lodash';
import { Logger } from '@logger';

@Injectable()
/**
 * The purpose of this service is to find and fix outstanding infringements that should
 * not be set to outstanding
 */
export class FixOutstandingInfringementService {
    constructor(private logger: Logger) {}

    async fix() {
        await this.fixStandard();
        await this.fixOriginalAmountZeroInfringements();
    }

    private async fixStandard() {
        const outstanding = await Infringement.findInvalidOutstanding().getMany();

        if (isEmpty(outstanding)) {
            return;
        }

        this.logger.debug({
            message: `Found ${outstanding.length} invalid outstanding infringement(s)`,
            detail: null,
            fn: this.fixStandard.name,
        });

        for (const outstandingInfringement of outstanding) {
            this.logger.log({
                message: `Setting infringement ${outstandingInfringement.noticeNumber} to Due`,
                detail: null,
                fn: this.fixStandard.name,
            });

            outstandingInfringement.status = InfringementStatus.Due;

            await InfringementLog.createAndSave({
                oldStatus: InfringementStatus.Outstanding,
                newStatus: InfringementStatus.Due,
                data: outstandingInfringement,
                infringement: outstandingInfringement,
            });

            await outstandingInfringement.save();
            await Log.createAndSave({
                infringement: outstandingInfringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: 'Set status to Due from Outstanding (automatic)',
            });

            this.logger.log({
                message: `Set infringement ${outstandingInfringement.noticeNumber} to Due`,
                detail: null,
                fn: this.fixStandard.name,
            });
        }
    }

    private async fixOriginalAmountZeroInfringements() {
        const infringements = await Infringement.createQueryBuilder('infringement')
            .andWhere('infringement.originalAmount = 0')
            .andWhere('infringement.status = :status', {
                status: InfringementStatus.Outstanding,
            })
            .andWhere('infringement.totalAmount = infringement.amountDue')
            .getMany();
        if (isEmpty(infringements)) {
            return;
        }

        this.logger.debug({
            message: `Found ${infringements.length} infringements with the original amount set to 0`,
            detail: null,
            fn: this.fixOriginalAmountZeroInfringements.name,
        });

        for (const infringement of infringements) {
            this.logger.log({
                message: `Setting infringement ${infringement.noticeNumber} to Due`,
                detail: null,
                fn: this.fixOriginalAmountZeroInfringements.name,
            });

            infringement.status = InfringementStatus.Due;
            infringement.originalAmount = infringement.amountDue;

            await InfringementLog.createAndSave({
                oldStatus: InfringementStatus.Outstanding,
                newStatus: InfringementStatus.Due,
                data: infringement,
                infringement,
            });

            await infringement.save();
            await Log.createAndSave({
                infringement,
                type: LogType.Warning,
                priority: LogPriority.High,
                message: 'Set status to Due from Outstanding (automatic) because it had an original amount of 0',
            });

            this.logger.log({
                message: `Set infringement ${infringement.noticeNumber} to Due`,
                detail: null,
                fn: this.fixStandard.name,
            });
        }
    }
}
