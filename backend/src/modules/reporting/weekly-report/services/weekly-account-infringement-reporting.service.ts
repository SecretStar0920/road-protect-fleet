import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { MultiSeries } from '@modules/shared/dtos/chart-data.model';
import { Infringement } from '@entities';
import { forEach, groupBy } from 'lodash';

@Injectable()
export class WeeklyAccountInfringementReportingService {
    constructor(private logger: Logger) {}

    async getInfringementData(accountId: number): Promise<ReportingDataDto<MultiSeries>> {
        const data: ReportingDataDto<MultiSeries> = {
            data: [
                { name: 'Nominated to me', series: [] },
                { name: 'Infringements on my vehicles', series: [] },
            ],
        };

        const nominated: Infringement[] = await Infringement.createQueryBuilder('infringement')
            .select(['infringement.infringementId', 'infringement.noticeNumber', 'infringement.status'])
            .innerJoin('infringement.nomination', 'nomination')
            .innerJoin('nomination.account', 'account', 'account.accountId = :id', { id: accountId })
            .getMany();
        const nominatedFormatted: any = groupBy<Infringement>(nominated, 'status');
        forEach(nominatedFormatted, (value, key) => {
            data.data[0].series.push({
                name: key,
                value: value.length,
                extra: value,
            });
        });

        const associated: Infringement[] = await Infringement.createQueryBuilder('infringement')
            .select(['infringement.infringementId', 'infringement.noticeNumber', 'infringement.status'])
            .leftJoin('infringement.vehicle', 'vehicle')
            // .innerJoin('vehicle.currentContract', 'currentContract')
            .innerJoin('infringement.contract', 'contract')
            .leftJoin('contract.user', 'user')
            .addSelect(['user.name', 'user.accountId'])
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.name', 'owner.accountId'])
            .andWhere('user.accountId = :id', { id: accountId })
            .orWhere('owner.accountId = :id', { id: accountId })
            .getMany();

        const associatedFormatted: any = groupBy<Infringement>(associated, 'status');
        forEach(associatedFormatted, (value, key) => {
            data.data[1].series.push({
                name: key,
                value: value.length,
                extra: value,
            });
        });

        return data;
    }
}
