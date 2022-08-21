import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { getManager } from 'typeorm';
import { InfringementStatusReportingDto } from '@modules/reporting/admin-reporting/controllers/infringement-status-reporting.dto';

@Injectable()
export class AdminInfringementStatusReportingService {
    constructor(private logger: Logger) {}

    async getInfringementStatusData(dto: InfringementStatusReportingDto): Promise<ReportingDataDto> {
        const raw: { value: string; name: string }[] = await getManager().query(
            `
            SELECT COUNT(infringement.*) as "value", InfringementStatus as "name"
            FROM unnest(enum_range(NULL::infringement_status_enum)) AS InfringementStatus
            LEFT JOIN infringement AS infringement
            ON infringement.status = InfringementStatus
            AND infringement."offenceDate"
            BETWEEN '${dto.createdRange[0].format('YYYY-MM-DD')}' AND '${dto.createdRange[1].format('YYYY-MM-DD')}'
            AND infringement."latestPaymentDate"
            BETWEEN '${dto.paymentRange[0].format('YYYY-MM-DD')}' AND '${dto.paymentRange[1].format('YYYY-MM-DD')}'
            GROUP BY InfringementStatus;`,
        );

        const data: ReportingDataDto = {
            data: raw.map((rawItem) => {
                return {
                    name: rawItem.name,
                    value: Number(rawItem.value),
                };
            }),
        };
        return data;
    }
}
