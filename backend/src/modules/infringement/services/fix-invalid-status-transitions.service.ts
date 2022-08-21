import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Infringement, InfringementStatus, RawInfringement } from '@entities';
import { chunk, uniq } from 'lodash';
import { Config } from '@config/config';
import { Brackets } from 'typeorm';
import { NominationStatus } from '@modules/shared/models/nomination-status';

@Injectable()
export class FixInvalidStatusTransitionsService {
    constructor(private logger: Logger) {}

    async fix(from?: string) {
        this.logger.debug({
            message: `Running the fix for infringements with invalid status transitions`,
            fn: this.fix.name,
        });

        const query = RawInfringement.createQueryBuilder('rawInfringement').where(`result->>'message' IN (:...messages)`, {
            messages: [
                'Invalid infringement status update. Cannot go from Closed to Due.',
                'Invalid infringement status update. Cannot go from Paid to Due.',
            ],
        });
        if (from) {
            query.andWhere(`createdAt > :date`, {
                date: from,
            });
        }
        const rawInfringements = await query.getMany().then((rawInfringementArray) =>
            rawInfringementArray.map((ri) => ({
                noticeNumber: ri.noticeNumber,
                issuerCode: ri.issuer,
            })),
        );
        const uniqueRawInfringement = uniq(rawInfringements);
        const infringements = await this.findInfringements(uniqueRawInfringement);
        await this.fixInfringements(infringements);
        this.logger.log({
            message: `Fixed ${infringements.length} infringements`,
            fn: this.fix.name,
        });
        return infringements;
    }

    private async findInfringements(rawInfringements: { noticeNumber: string; issuerCode: string }[]): Promise<Infringement[]> {
        let result: Infringement[] = [];

        const chunks = chunk(rawInfringements, Config.get.systemPerformance.queryChunkSize);

        for (const rawInfringementChunk of chunks) {
            const query = Infringement.findWithMinimalRelations();
            for (const rawInfringement of rawInfringementChunk) {
                query.orWhere(
                    new Brackets((qb) =>
                        qb
                            .andWhere(`infringement.noticeNumber = :noticeNumber`, {
                                noticeNumber: rawInfringement.noticeNumber,
                            })
                            .andWhere(`issuer.code = :issuerCode`, {
                                issuerCode: rawInfringement.issuerCode,
                            }),
                    ),
                );
            }
            result = result.concat(await query.getMany());
        }

        return result;
    }

    private async fixInfringements(infringements: Infringement[]) {
        for (const infringement of infringements) {
            this.logger.warn({
                fn: this.fixInfringements.name,
                message: `Setting the status of infringement with notice number ${infringement.noticeNumber} and issuer ${infringement.issuer.name} from ${infringement.status} to Due`,
                detail: infringement,
            });
            infringement.status = InfringementStatus.Due;
            const { nomination } = infringement;
            if (nomination.status === NominationStatus.Closed) {
                nomination.status = NominationStatus.Acknowledged;
                await nomination.save();
            }
            await infringement.save();
        }
    }
}
