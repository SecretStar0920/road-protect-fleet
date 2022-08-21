import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { Issuer } from '@entities';
import { MultiSeries } from '@modules/shared/dtos/chart-data.model';
import { forEach, groupBy } from 'lodash';

@Injectable()
export class AdminIssuerInfringementsReportingService {
    constructor(private logger: Logger) {}

    async getIssuerInfringementsData(): Promise<ReportingDataDto<MultiSeries>> {
        const data: ReportingDataDto<MultiSeries> = { data: [] };

        const raw: any[] = await Issuer.createQueryBuilder('issuer')
            .innerJoin('issuer.infringements', 'infringement')
            .select('count (infringement.noticeNumber)', 'value')
            .addSelect('issuer.name', 'name')
            .addSelect('infringement.status', 'status')
            .groupBy('issuer.name')
            .addGroupBy('infringement.status')
            .orderBy('value')
            .addOrderBy('value', 'DESC')
            .limit(50)
            .getRawMany();

        const groupedData = groupBy(raw, (row) => {
            return row.name;
        });

        forEach(groupedData, (value, key) => {
            if (key) {
                data.data.push({
                    name: key,
                    series: value.map((val) => {
                        return {
                            name: val.status,
                            value: val.value,
                        };
                    }),
                });
            }
        });

        return data;
    }
}
