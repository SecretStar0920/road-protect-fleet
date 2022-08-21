import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { IsDefined, IsIn, IsNumber } from 'class-validator';
import { Account, ContractStatus, InfringementStatus } from '@entities';
import { getManager } from 'typeorm';
import { NominationStatus } from '@modules/shared/models/nomination-status';
import { DateRangeDto } from '@modules/graphing/controllers/date-range.dto';
import * as moment from 'moment';
import { GetSummaryIndicatorsDto } from '@modules/graphing/controllers/get-summary-indicators.dto';
import {
    NgxDataPoint,
    NgxSeriesData,
    SummaryIndicatorsDataManipulationService,
} from '@modules/graphing/services/summary-indicators-data-manipulation.service';

export class ManagedVehicles {
    @IsDefined()
    @IsNumber()
    year: number;

    @IsDefined()
    @IsIn(Object.values(ContractStatus))
    status: ContractStatus;

    @IsDefined()
    @IsNumber()
    count: number;
}

export class RawInfringementCostData {
    @IsDefined()
    @IsNumber()
    year: number;

    @IsDefined()
    @IsNumber()
    count: number;

    @IsDefined()
    @IsNumber()
    totalAmount: number;

    @IsDefined()
    @IsNumber()
    penaltyAmount: number;

    @IsDefined()
    @IsNumber()
    amountDue: number;

    @IsDefined()
    @IsNumber()
    originalAmount: number;

    @IsDefined()
    @IsNumber()
    totalPayments: number;
}

export class RawRedirectionData {
    @IsDefined()
    @IsNumber()
    year: number;

    @IsDefined()
    @IsNumber()
    count: number;

    @IsDefined()
    @IsIn(Object.values(NominationStatus))
    status: NominationStatus;
}

export class RawUnmanagedVehiclesData {
    @IsDefined()
    @IsNumber()
    year: number;

    @IsDefined()
    @IsNumber()
    count: number;

    @IsDefined()
    @IsIn(Object.values(InfringementStatus))
    status: InfringementStatus;
}

export class RawSummaryIndicatorData {
    @IsDefined()
    accountId: number;

    @IsDefined()
    rawManagedVehiclesData: ManagedVehicles[];

    @IsDefined()
    rawInfringementCostData: RawInfringementCostData[];

    @IsDefined()
    rawRedirectionData: RawRedirectionData[];

    @IsDefined()
    rawUnmanagedVehiclesData: RawUnmanagedVehiclesData[];
}

export class ThisYearSummaryIndicatorData {
    @IsDefined()
    accountId: number;

    @IsDefined()
    manipulatedManagedVehiclesData: NgxDataPoint[];

    @IsDefined()
    manipulatedInfringementCostData: NgxDataPoint[];

    @IsDefined()
    manipulatedRedirectionData: NgxDataPoint[];

    @IsDefined()
    manipulatedUnmanagedVehiclesData: NgxDataPoint[];
}

export class ComparisonSummaryIndicatorData {
    @IsDefined()
    accountId: number;

    @IsDefined()
    manipulatedManagedVehiclesData: NgxSeriesData[];

    @IsDefined()
    manipulatedInfringementCostData: NgxSeriesData[];

    @IsDefined()
    manipulatedRedirectionData: NgxSeriesData[];

    @IsDefined()
    manipulatedUnmanagedVehiclesData: NgxSeriesData[];

    @IsDefined()
    comparisonDates: DateRangeDto;
}

@Injectable()
export class SummaryIndicatorsService {
    constructor(private logger: Logger, private summaryIndicatorsDataManipulationService: SummaryIndicatorsDataManipulationService) {}

    async getThisYearSummaryIndicators(accountId: number, dto: GetSummaryIndicatorsDto): Promise<ThisYearSummaryIndicatorData> {
        const rawSummaryIndicatorData: RawSummaryIndicatorData = await this.getSummaryIndicators(accountId, dto);
        return this.manipulateDataForThisYear(rawSummaryIndicatorData, accountId);
    }

    async getComparisonSummaryIndicators(accountId: number, dto: GetSummaryIndicatorsDto): Promise<ComparisonSummaryIndicatorData> {
        const rawSummaryIndicatorData: RawSummaryIndicatorData = await this.getSummaryIndicators(accountId, dto);
        return this.manipulateDataForYearComparison(rawSummaryIndicatorData, accountId, dto.dateRange);
    }

    async getSummaryIndicators(accountId: number, dto: GetSummaryIndicatorsDto): Promise<RawSummaryIndicatorData> {
        this.logger.debug({
            message: `Getting summary indicators for account`,
            detail: { accountId, dto },
            fn: this.getSummaryIndicators.name,
        });

        const rawSummaryIndicatorData: RawSummaryIndicatorData = await this.getAllData(accountId, dto.dateRange);
        return rawSummaryIndicatorData;
    }

    async getAllData(accountId: number, dateRange: DateRangeDto): Promise<RawSummaryIndicatorData> {
        const rawManagedVehiclesData = await this.getManagedVehicleData(accountId, dateRange);
        const rawInfringementCostData = await this.getInfringementCost(accountId, dateRange);
        const rawRedirectionData = await this.getRedirectionSummary(accountId, dateRange);
        const rawUnmanagedVehiclesData = await this.getUnmanagedVehiclesData(accountId, dateRange);
        const rawSummaryIndicatorData: RawSummaryIndicatorData = {
            accountId,
            rawManagedVehiclesData,
            rawInfringementCostData,
            rawRedirectionData,
            rawUnmanagedVehiclesData,
        };
        return rawSummaryIndicatorData;
    }

    async getManagedVehicleData(accountId: number, dateRange: DateRangeDto): Promise<ManagedVehicles[]> {
        const numberOfYearsNeeded = Math.ceil(moment(dateRange.endDate).diff(moment(dateRange.startDate), 'years', true));
        let rawManagedVehiclesData: ManagedVehicles[] = [];
        let interval = `+ interval '${numberOfYearsNeeded}  years'`;
        if (numberOfYearsNeeded === 1) {
            interval = '';
        }
        rawManagedVehiclesData = await getManager().query(
            `SELECT
                    EXTRACT(YEAR FROM CAST("generate_series" AS timestamptz)) AS "year",
                    "status",  count(*)
                    FROM generate_series(date_trunc('year', date($1)), date($1) ${interval}, interval '1 year')
                    LEFT JOIN "contract" ON ("contract"."startDate" <=  "generate_series" )
                    WHERE ("contract"."userId" = $2 OR "contract"."ownerId" = $2)
                    AND "contract"."endDate" > ( "generate_series" + '1 year')
                    GROUP BY "year", "status"
                    ORDER BY  "year" DESC `,
            [dateRange.startDate, accountId],
        );
        return rawManagedVehiclesData;
    }

    async getInfringementCost(accountId: number, dateRange: DateRangeDto): Promise<RawInfringementCostData[]> {
        const account = await Account.findByIdentifierOrId(String(accountId));
        const raw: RawInfringementCostData[] = await getManager().query(
            `SELECT
                    EXTRACT(YEAR FROM "infringement"."offenceDate") AS "year",
                    count(*),
                    sum("totalAmount") AS "totalAmount",
                    sum("penaltyAmount") AS "penaltyAmount",
                    sum("amountDue") AS "amountDue",
                    sum("originalAmount") AS "originalAmount",
                    sum("totalPayments") AS "totalPayments"
                    FROM "infringement"
                    LEFT JOIN "contract" "infringementContract" ON "infringementContract"."contractId"="infringement"."contractId"
                    LEFT JOIN "account" "user" ON "user"."accountId"="infringementContract"."userId"
                    LEFT JOIN "account" "owner" ON "owner"."accountId"="infringementContract"."ownerId"
                    WHERE (("user"."accountId" = $1 OR "owner"."accountId" = $1 OR "infringement"."brn" = $2) AND ("infringement"."offenceDate" >=  $3
                    AND "infringement"."offenceDate" <  $4))
                    GROUP BY "year"
                    ORDER BY  "year" DESC `,
            [accountId, account.identifier, dateRange.startDate, dateRange.endDate],
        );
        return raw;
    }

    async getRedirectionSummary(accountId: number, dateRange: DateRangeDto): Promise<RawRedirectionData[]> {
        const account = await Account.findByIdentifierOrId(String(accountId));
        const raw: RawRedirectionData[] = await getManager().query(
            `SELECT
                    EXTRACT(YEAR FROM "infringement"."offenceDate") AS "year",
                    count(*),  "nomination"."status"
                    FROM "infringement"
                    LEFT JOIN "contract" ON "contract"."contractId" = "infringement"."contractId"
                    LEFT JOIN "nomination" ON "infringement"."infringementId" = "nomination"."infringementId"
                    WHERE ((("contract"."userId" = $1 OR "contract"."ownerId" = $1) OR "infringement"."brn" = $2)
                    AND ("infringement"."offenceDate" BETWEEN $3 AND $4))
                    GROUP BY "year", "nomination"."status"
                    ORDER BY  "year" DESC `,
            [accountId, account.identifier, dateRange.startDate, dateRange.endDate],
        );
        return raw;
    }

    async getUnmanagedVehiclesData(accountId: number, dateRange: DateRangeDto): Promise<RawUnmanagedVehiclesData[]> {
        const account = await Account.findByIdentifierOrId(String(accountId));
        const raw: RawUnmanagedVehiclesData[] = await getManager().query(
            `SELECT
                    EXTRACT(YEAR FROM "infringement"."offenceDate") AS "year","infringement"."status" ,
                    COUNT(CASE WHEN "infringement"."contractId" IS NULL THEN 1 ELSE NULL END) AS "count"
                    FROM "infringement"
                    LEFT JOIN "contract" ON "contract"."contractId" = "infringement"."contractId"
                    WHERE (("infringement"."brn" = $1) AND ("infringement"."offenceDate" BETWEEN $2 AND $3))
                    GROUP BY "year", "infringement"."status"
                    ORDER BY  "year" DESC `,
            [account.identifier, dateRange.startDate, dateRange.endDate],
        );
        return raw;
    }

    private manipulateDataForThisYear(rawSummaryIndicatorData: RawSummaryIndicatorData, accountId): ThisYearSummaryIndicatorData {
        this.logger.debug({
            message: `Manipulating summary indicators for current year`,
            fn: this.manipulateDataForThisYear.name,
        });
        const thisYearSummaryIndicatorData: ThisYearSummaryIndicatorData = {
            accountId,
            // Infringement Cost
            manipulatedInfringementCostData: this.summaryIndicatorsDataManipulationService.manipulateRawData(
                rawSummaryIndicatorData.rawInfringementCostData,
            ),
            // Redirection Information
            manipulatedRedirectionData: this.summaryIndicatorsDataManipulationService.manipulateRawDataByStatus(
                rawSummaryIndicatorData.rawRedirectionData,
            ),
            // Unmanaged Vehicles
            manipulatedUnmanagedVehiclesData: this.summaryIndicatorsDataManipulationService.manipulateRawDataByStatus(
                rawSummaryIndicatorData.rawUnmanagedVehiclesData,
            ),
            // Managed Vehicles
            manipulatedManagedVehiclesData: this.summaryIndicatorsDataManipulationService.manipulateRawDataByStatus(
                rawSummaryIndicatorData.rawManagedVehiclesData,
            ),
        };

        return thisYearSummaryIndicatorData;
    }

    private manipulateDataForYearComparison(
        rawSummaryIndicatorData: RawSummaryIndicatorData,
        accountId,
        dateRange: DateRangeDto,
    ): ComparisonSummaryIndicatorData {
        this.logger.debug({
            message: `Manipulating summary indicators for year comparison`,
            fn: this.manipulateDataForYearComparison.name,
        });
        const comparisonSummaryIndicatorData: ComparisonSummaryIndicatorData = {
            accountId,
            comparisonDates: dateRange,
            // Infringement Cost
            manipulatedInfringementCostData: this.summaryIndicatorsDataManipulationService.manipulateRawToYearComparisonData(
                rawSummaryIndicatorData.rawInfringementCostData,
            ),
            // Redirection Information
            manipulatedRedirectionData: this.summaryIndicatorsDataManipulationService.manipulateRawToYearComparisonDataByStatus(
                rawSummaryIndicatorData.rawRedirectionData,
            ),
            // Unmanaged Vehicles
            manipulatedUnmanagedVehiclesData: this.summaryIndicatorsDataManipulationService.manipulateRawToYearComparisonDataByStatus(
                rawSummaryIndicatorData.rawUnmanagedVehiclesData,
            ),
            // Managed Vehicles
            manipulatedManagedVehiclesData: this.summaryIndicatorsDataManipulationService.manipulateRawToYearComparisonDataByStatus(
                rawSummaryIndicatorData.rawManagedVehiclesData,
            ),
        };

        return comparisonSummaryIndicatorData;
    }
}
