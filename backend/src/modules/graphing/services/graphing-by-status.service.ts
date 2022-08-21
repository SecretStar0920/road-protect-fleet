import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { isNil } from 'lodash';
import * as moment from 'moment';
import { IsDefined, IsIn, IsNumber, IsString } from 'class-validator';
import { Account, InfringementStatus } from '@entities';
import { GraphingDataDto, ReportingEndpoints } from '@modules/graphing/controllers/graphing-data.dto';
import { Logger } from '@logger';

export class RawGraphingByStatusData {
    @IsDefined()
    @IsIn(Object.values(InfringementStatus))
    status: InfringementStatus;

    @IsDefined()
    @IsString()
    offenceDate: string;

    @IsDefined()
    @IsNumber()
    sum: number;

    @IsDefined()
    @IsNumber()
    count: number;
}

@Injectable()
export class GraphingByStatusService {
    constructor(private logger: Logger) {}

    async getAggregatedByStatusData(accountId: number, dto: GraphingDataDto) {
        this.logger.debug({ message: 'Getting status data', detail: { accountId, dto }, fn: this.getAggregatedByStatusData.name });

        if (isNil(dto.startDate)) {
            dto.startDate = moment().subtract(1, 'year').toISOString();
        }
        if (isNil(dto.endDate)) {
            dto.endDate = moment().toISOString();
        }
        // Update query based on ownership string
        let endpointQuery: string = '';
        if (dto.endpoint === ReportingEndpoints.Owner) {
            endpointQuery = `("owner"."accountId" = $1)`;
        } else if (dto.endpoint === ReportingEndpoints.User) {
            endpointQuery = '"user"."accountId" = $1';
        } else {
            // Show all
            endpointQuery = `("owner"."accountId" = $1 OR "user"."accountId" = $1)`;
        }

        const account = await Account.findByIdentifierOrId(String(accountId));
        const raw: RawGraphingByStatusData[] = await getManager().query(
            `SELECT "public"."infringement"."status" AS "status",
                date_trunc('month',"public"."infringement"."offenceDate") AS "offenceDate",
                count(*) AS "count", sum("public"."infringement"."totalAmount") AS "sum"
                FROM "public"."infringement"
                LEFT JOIN "contract" "infringementContract" ON "infringementContract"."contractId"="infringement"."contractId"
                LEFT JOIN "account" "owner" ON "owner"."accountId"="infringementContract"."ownerId"
                LEFT JOIN "account" "user" ON "user"."accountId"="infringementContract"."userId"
                WHERE ( (${endpointQuery} OR "infringement"."brn" = $2)
                AND ("infringement"."offenceDate" >=  $3 AND "infringement"."offenceDate" <  $4))
                GROUP BY "public"."infringement"."status", date_trunc('month',"public"."infringement"."offenceDate" )
                ORDER BY  date_trunc('month', "public"."infringement"."offenceDate" ) ASC  , "public"."infringement"."status" ASC`,
            [accountId, account.identifier, dto.startDate, dto.endDate],
        );

        return raw;
    }
}
