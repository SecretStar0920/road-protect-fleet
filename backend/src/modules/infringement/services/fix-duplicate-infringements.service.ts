import { Injectable } from '@nestjs/common';
import { Infringement } from '@entities';
import { Config } from '@config/config';
import { chunk } from 'lodash';

@Injectable()
export class FixDuplicateInfringementsService {
    constructor() {}

    async fixDuplicates() {
        const infringements = await Infringement.createQueryBuilder('infringement')
            .leftJoinAndSelect('infringement.issuer', 'issuer')
            .getMany();

        const mapping: { [noticeNumber: string]: Infringement[] } = {};

        for (const infringement of infringements) {
            const trimmedNoticeNumber = infringement.noticeNumber.toString();
            const noticeNumber = Number(trimmedNoticeNumber).toString();
            const noticeNumberAndIssuer = `${noticeNumber}-${infringement.issuer.name}`;
            mapping[noticeNumberAndIssuer] = mapping[noticeNumberAndIssuer] || [];
            mapping[noticeNumberAndIssuer].push(infringement);
        }

        const keys = Object.keys(mapping).filter((key) => mapping.hasOwnProperty(key));
        const infringementIds: number[] = [];
        for (const key of keys) {
            if (mapping[key].length === 1) {
                delete mapping[key];
                continue;
            }
            mapping[key].forEach((inf) => infringementIds.push(inf.infringementId));
        }
        const fullInfringements = await this.pullInfringements(infringementIds);

        let outputCsv = '';
        for (const key of keys) {
            if (!mapping[key]) {
                continue;
            }
            outputCsv +=
                mapping[key]
                    .map((inf) => fullInfringements[inf.infringementId])
                    .map(
                        (inf) =>
                            `${inf.infringementId},${inf.noticeNumber},${inf.status},${inf.nomination.status},${inf.updatedAt},${inf.externalChangeDate}`,
                    )
                    .join(',') + '\n';
        }

        const count = Object.keys(mapping).length;

        return { mapping, count, outputCsv };
    }

    private async pullInfringements(infringementIds: number[]) {
        const result: { [infringementId: number]: Infringement } = {};
        const chunks = chunk(infringementIds, Config.get.systemPerformance.queryChunkSize);
        for (const chunk of chunks) {
            const infringements = await Infringement.findWithMinimalRelations()
                .where('infringement.infringementId IN (:...ids)', {
                    ids: chunk,
                })
                .getMany();
            for (const infringement of infringements) {
                result[infringement.infringementId] = infringement;
            }
        }
        return result;
    }
}
