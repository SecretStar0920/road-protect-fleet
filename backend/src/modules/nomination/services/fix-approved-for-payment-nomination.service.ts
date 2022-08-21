import { Logger } from '@logger';
import { Infringement, InfringementStatus, Nomination, NominationRevisionHistory } from '@entities';
import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { isEmpty } from 'lodash';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
/*
 * The goal of this service is to transfer approved for payment status on nominations to
 * approved for payment on infringement status as well as the approved date
 *  */
export class FixApprovedForPaymentNominationService {
    constructor(private logger: Logger) {}

    async fix() {
        this.logger.log({
            fn: this.fix.name,
            message: `Move nominations in approved for payment status to be infringements with approved for payment status`,
        });

        const infringements = await this.getInfringements();

        if (isEmpty(infringements)) {
            this.logger.log({
                fn: this.fix.name,
                message: `No infringements were found that should be moved across.`,
            });
            return;
        }

        this.logger.log({
            fn: this.fix.name,
            message: `Found ${infringements.length} infringements that should be moved across.`,
        });

        await Promise.all(
            infringements.map(async (infringement) => {
                const nomination = infringement.nomination;
                //    calculate previous nomination status and set nomination status
                const previousStatus = await this.getPreviousNominationStatus(nomination);
                //    move approved date to infringement and set infringement status
                await this.moveApprovedDateAndSetNewStatuses(infringement, nomination, previousStatus);

                return infringement;
            }),
        );

        this.logger.log({
            fn: this.fix.name,
            message: ` ${infringements.length} infringements have been moved to infringement status as approved for payment`,
        });

        return infringements;
    }

    private async getInfringements() {
        return Infringement.findWithMinimalRelations()
            .andWhere('nomination.status NOT IN (...statuses)', {
                statuses: [
                    NominationStatus.Acknowledged,
                    NominationStatus.InRedirectionProcess,
                    NominationStatus.Closed,
                    NominationStatus.Pending,
                    NominationStatus.RedirectionCompleted,
                ],
            })
            .getMany();
    }

    private async moveApprovedDateAndSetNewStatuses(infringement: Infringement, nomination: Nomination, previousStatus: NominationStatus) {
        // infringement.approvedDate = nomination.approvedDate;
        // nomination.approvedDate = null;

        infringement.status = InfringementStatus.ApprovedForPayment;
        nomination.status = previousStatus;

        await infringement.save();
        await nomination.save();

        return { infringement, nomination };
    }

    private async getPreviousNominationStatus(nomination: Nomination) {
        const nominationRevisionHistories = await getConnection()
            .createQueryBuilder()
            .select('nomination_revision_history')
            .from(NominationRevisionHistory, 'nomination_revision_history')
            .where('"nomination_revision_history"."nominationId" = :id', { id: nomination.nominationId })
            .orderBy('"nomination_revision_history"."timestamp"', 'DESC')
            .getMany();

        if (isEmpty(nominationRevisionHistories)) {
            this.logger.log({
                fn: this.fix.name,
                message: `No revision history was found for the nomination, default to Acknowledged`,
            });
            return NominationStatus.Acknowledged;
        }

        const previousStatus = nominationRevisionHistories.find((history) => {
            return history.old?.status !== 'Approved for Payment';
        });
        return previousStatus.old.status || NominationStatus.Acknowledged; // defaults to acknowledged if no previous status is found
    }
}
