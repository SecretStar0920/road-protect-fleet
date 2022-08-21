import { Injectable } from '@nestjs/common';
import { Account, Contract, Infringement } from '@entities';
import { Logger } from '@logger';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Brackets, getManager } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class SummaryIndicatorsQueryService {
    constructor(private logger: Logger) {}

    async getInfringementsWithoutContracts(
        baseQuery: SelectQueryBuilder<Infringement>,
        accountId: number,
    ): Promise<SelectQueryBuilder<Infringement>> {
        this.logger.debug({ message: 'Finding summary indicator information', fn: this.getInfringementsWithoutContracts.name });
        const account = await Account.findByIdentifierOrId(String(accountId));
        // Account
        baseQuery.andWhere(
            new Brackets((qb) => {
                qb.orWhere(
                    new Brackets((qb1) => {
                        qb1.andWhere('user.accountId NOT IN (:accountId)', { accountId });
                        qb1.andWhere('owner.accountId NOT IN (:accountId)', { accountId });
                    }),
                );
                qb.orWhere('infringement."contractId" IS NULL');
            }),
        );
        baseQuery.andWhere('infringement.brn = :identifier', { identifier: account.identifier });
        return baseQuery;
    }

    getContracts(
        baseQuery: SelectQueryBuilder<Contract>,
        accountId: number,
        startDate: string,
        endDate: string,
    ): SelectQueryBuilder<Contract> {
        this.logger.debug({ message: 'Finding summary indicator information', fn: this.getContracts.name });

        baseQuery.andWhere(
            new Brackets((qb1) => {
                qb1.andWhere('user.accountId = :accountId', { accountId });
                qb1.orWhere('owner.accountId = :accountId', { accountId });
            }),
        );
        baseQuery.andWhere(
            new Brackets((qb2) => {
                qb2.orWhere(
                    new Brackets((qb1) => {
                        // Contract starts before and ends after the start range
                        qb1.andWhere('contract.startDate < :startDate', { startDate });
                        qb1.andWhere('contract.endDate > :startDate', { startDate });
                    }),
                );
                // Or starts within the range
                qb2.orWhere('contract.startDate BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });
            }),
        );
        return baseQuery;
    }
}
