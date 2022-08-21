import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { MultiSeries } from '@modules/shared/dtos/chart-data.model';
import { getManager } from 'typeorm';
import * as moment from 'moment';
import { forEach, groupBy } from 'lodash';
import { InfringementCalendarQueryDto } from '@modules/reporting/admin-reporting/controllers/infringement-calendar-query.dto';

@Injectable()
export class AdminInfringementsDueReportingService {
    constructor(private logger: Logger) {}

    async getInfringementsDueData(dto: InfringementCalendarQueryDto): Promise<ReportingDataDto<MultiSeries>> {
        const range = dto.date.diff(moment(), 'days');

        const raw: { date: string; count: number }[] = await getManager().query(
            `
            SELECT dates.date, count(infringement.*)
            FROM (
                SELECT to_char(date_trunc('day', (current_date + dateSeries)), 'YYYY-MM-DD') AS date
                FROM generate_series(0, ${range}, 1) AS dateSeries
            )  dates
            left outer join infringement
            ON dates.date = to_char(date_trunc('day', infringement."latestPaymentDate"), 'YYYY-MM-DD')
            GROUP BY dates.date
            order by dates.date;`,
        );

        // WHERE infringement."status" != '${InfringementStatus.Paid}'

        return this.generateData(raw);
    }

    generateData(raw: { date: string; count: number }[]): ReportingDataDto<MultiSeries> {
        const data: ReportingDataDto<MultiSeries> = {
            data: [],
        };

        const groupedData = groupBy(raw, (rawItem) => {
            return moment(rawItem.date, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');
        });

        forEach(groupedData, (value, key: string) => {
            data.data.push({
                name: moment(key).toISOString(),
                series: value.map((val) => {
                    const itemDate = moment(val.date, 'YYYY-MM-DD');
                    return {
                        name: itemDate.format('dddd'),
                        value: Number(val.count),
                        extra: {
                            date: itemDate.format('dddd, MMMM Do YYYY'),
                        },
                    };
                }),
            });
        });

        return data;
    }
}
