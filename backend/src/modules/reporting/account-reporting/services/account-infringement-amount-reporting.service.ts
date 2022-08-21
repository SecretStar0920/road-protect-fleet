import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { Infringement } from '@entities';
import BigNumber from 'bignumber.js';

@Injectable()
export class AccountInfringementAmountReportingService {
    constructor(private logger: Logger) {}

    async getInfringementAmountData(accountId: number): Promise<ReportingDataDto> {
        const data = { data: [] };

        const query: { status: string; total: string }[] = await Infringement.createQueryBuilder('infringement')
            .leftJoinAndSelect('infringement.nomination', 'nomination')
            .innerJoin('nomination.account', 'account', 'account.accountId = :id', { id: accountId })
            .select('SUM(infringement.amountDue)', 'total')
            .addSelect('nomination.status', 'status')
            .groupBy('nomination.status')
            .getRawMany();

        const total: { total: number } = await Infringement.createQueryBuilder('infringement')
            .leftJoinAndSelect('infringement.nomination', 'nomination')
            .innerJoin('nomination.account', 'account', 'account.accountId = :id', { id: accountId })
            .select('SUM(infringement.amountDue)', 'total')
            .getRawOne();

        data.data = query.map((o) => {
            return {
                name: o.status,
                value: new BigNumber(o.total).toNumber(),
            };
        });

        data.data.push({
            name: 'Total',
            value: new BigNumber(total.total || 0).toNumber(),
        });

        return data;
    }
}
