import { Injectable } from '@nestjs/common';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { Account, Issuer } from '@entities';
import { isNil } from 'lodash';
import * as moment from 'moment';
import { getManager } from 'typeorm';
import { GraphingDataDto, ReportingEndpoints } from '@modules/graphing/controllers/graphing-data.dto';
import { Logger } from '@logger';

export class RawGraphingByIssuerData {
    @IsDefined()
    issuer: Issuer;

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
export class GraphingByIssuerService {
    constructor(private logger: Logger) {}

    async getAggregatedByIssuerData(accountId: number, dto: GraphingDataDto) {
        this.logger.debug({ message: 'Getting issuer data', detail: { accountId, dto }, fn: this.getAggregatedByIssuerData.name });
        const account = await Account.findByIdentifierOrId(String(accountId));


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

        let parameters = [accountId, account.identifier];

        let query = `SELECT "Issuer"."name" AS "name",
        date_trunc('month',"public"."infringement"."offenceDate") AS "offenceDate","public"."infringement"."status" AS "status",
        count(*) AS "count", sum("public"."infringement"."totalAmount") AS "sum"
        FROM "public"."infringement"
        LEFT JOIN "contract" "infringementContract" ON "infringementContract"."contractId"="infringement"."contractId"
        LEFT JOIN "public"."issuer" "Issuer" ON "public"."infringement"."issuerId" = "Issuer"."issuerId"
        LEFT JOIN "account" "owner" ON "owner"."accountId"="infringementContract"."ownerId"
        LEFT JOIN "account" "user" ON "user"."accountId"="infringementContract"."userId"
        WHERE (${endpointQuery} OR "infringement"."brn" = $2)`;
        let nextParamNumber = parameters.length + 1

        if (!!dto.startDate) {
            query += ` AND "infringement"."offenceDate" >= $${nextParamNumber} `
            parameters.push(dto.startDate)
            nextParamNumber += 1
        }

        if (!!dto.endDate) {
            query += ` AND "infringement"."offenceDate" < $${nextParamNumber} `
            parameters.push(dto.endDate)
            nextParamNumber += 1
        }

        query += ` GROUP BY "Issuer"."issuerId", "public"."infringement"."status", date_trunc('month',"public"."infringement"."offenceDate" )
                   ORDER BY date_trunc('month', "public"."infringement"."offenceDate" ) ASC , "sum" DESC `

        console.log(endpointQuery, query)

        const raw: RawGraphingByIssuerData[] = await getManager().query(
            query,
            parameters,
        );

        console.log('Reporting', raw)

        return raw;
    }
}
