import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Log, LogPriority, LogType, Nomination } from '@entities';
import { getManager } from 'typeorm';
import { isNil } from 'lodash';
import { AcknowledgeNominationDto } from '@modules/nomination/dtos/acknowledge-nomination.dto';
import { BatchAcknowledgeNominationDto } from '@modules/nomination/dtos/batch-acknowledge-nomination.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class AcknowledgeNominationService {
    constructor(private logger: Logger) {}

    async acknowledgeNomination(id: number, dto: AcknowledgeNominationDto): Promise<Nomination> {
        this.logger.log({ message: 'Acknowledge Nomination: ', detail: id, fn: this.acknowledgeNomination.name });
        let nomination = await Nomination.findWithMinimalRelations().andWhere('nomination.nominationId = :id', { id }).getOne();

        if (isNil(nomination)) {
            throw new BadRequestException({ message: ERROR_CODES.E020_CouldNotFindNomination.message() });
        }

        if (nomination.status !== NominationStatus.Pending) {
            this.logger.warn({
                message: 'Attempted to acknowledge a non-pending nomination',
                detail: null,
                fn: this.acknowledgeNomination.name,
            });
            return nomination;
        }

        await getManager().transaction(async (transaction) => {
            nomination.status = NominationStatus.Acknowledged;
            nomination.details = nomination.details || {};
            nomination.details.acknowledgedFor = dto.acknowledgedFor;
            nomination = await transaction.save(nomination);
        });
        this.logger.log({ message: 'Acknowledge Nomination: ', detail: id, fn: this.acknowledgeNomination.name });

        await Log.createAndSave({
            infringement: nomination.infringement,
            type: LogType.Updated,
            message: 'Infringement acknowledge',
            priority: LogPriority.High,
        });

        return nomination;
    }

    async batchAcknowledgeNomination(dto: BatchAcknowledgeNominationDto): Promise<Nomination[]> {
        const acknowledgeNominations: Nomination[] = [];
        const failedApprovals = [];
        for (const id of dto.nominationIds) {
            try {
                const nomination = await this.acknowledgeNomination(id, { acknowledgedFor: dto.acknowledgedFor });
                acknowledgeNominations.push(nomination);
            } catch (e) {
                failedApprovals.push(id);
                this.logger.warn({
                    message: 'Failed to acknowledge a nomination',
                    detail: {
                        error: e.message,
                        stack: e.stack,
                    },
                    fn: this.batchAcknowledgeNomination.name,
                });
            }
        }

        return acknowledgeNominations;
    }
}
