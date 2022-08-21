import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { isNil } from 'lodash';
import * as moment from 'moment';
import { IsBoolean, IsDefined, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Account, InfringementStatus } from '@entities';
import { Logger } from '@logger';
import { Config } from '@config/config';
import {
    GetInfringementProjectionDto,
    InfringementPredictionEndpoints,
} from '@modules/graphing/controllers/get-infringement-projection.dto';

export class RawInfringementPredictionData {
    @IsDefined()
    @IsString()
    offenceYear: string;

    @IsDefined()
    @IsString()
    offenceMonth: string;

    @IsDefined()
    @IsNumber()
    infringementCount: number;

    @IsOptional()
    @IsNumber()
    infringementCountPaid?: number;

    @IsOptional()
    @IsNumber()
    infringementCountDue?: number;

    @IsOptional()
    @IsNumber()
    infringementCountOutstanding?: number;

    @IsOptional()
    @IsNumber()
    infringementCountApproved?: number;

    @IsOptional()
    @IsNumber()
    infringementCountClosed?: number;

    @IsDefined()
    @IsNumber()
    vehicleCount: number;

    @IsOptional()
    @IsNumber()
    vehicleCountTotal?: number;

    @IsOptional()
    @IsNumber()
    noContractCount: number;

    @IsDefined()
    @IsNumber()
    value: number;

    @IsOptional()
    @IsNumber()
    valuePaid?: number;

    @IsOptional()
    @IsNumber()
    valueDue?: number;

    @IsOptional()
    @IsNumber()
    valueOutstanding?: number;

    @IsOptional()
    @IsNumber()
    valueApproved?: number;

    @IsOptional()
    @IsNumber()
    valueClosed?: number;

    @IsOptional()
    @IsBoolean()
    predicted?: boolean = false;
}

export enum RawInfringementPredictionWarnings {
    noContracts = 'no_vehicle_contracts',
    noPreviousData = 'no_previous_data',
}

export class InfringementProjectionDataDto {
    @IsDefined()
    data: RawInfringementPredictionData[];

    @IsOptional()
    @IsIn(Object.values(RawInfringementPredictionWarnings))
    warning?: RawInfringementPredictionWarnings;
}

export class RawValidContractCountData {
    @IsDefined()
    @IsString()
    date: string;

    @IsDefined()
    @IsNumber()
    contractCount: number;
}

@Injectable()
export class InfringementProjectionService {
    constructor(private logger: Logger) {}

    async getInfringementProjectionData(accountId: number, dto: GetInfringementProjectionDto): Promise<InfringementProjectionDataDto> {
        this.logger.debug({
            message: `Getting infringement projection data.`,
            detail: dto,
            fn: this.getInfringementProjectionData.name,
        });
        // Setup dates
        let startDate = dto.dateRange.startDate;
        let endDate = dto.dateRange.endDate;
        if (isNil(dto.dateRange.startDate)) {
            startDate = moment().subtract(1, 'year').toISOString();
            this.logger.debug({ message: `Set start date to ${startDate}`, fn: this.getInfringementProjectionData.name });
        }
        if (isNil(dto.dateRange.endDate)) {
            this.logger.debug({ message: `Set end date to ${endDate}`, fn: this.getInfringementProjectionData.name });
            endDate = moment().toISOString();
        }
        // Get the data from the backend
        let rawInfringementData = await this.getInfringementData(accountId, dto);
        if (isNil(rawInfringementData) || rawInfringementData.length < 1) {
            this.logger.debug({
                message: `No infringement projection data is found.`,
                fn: this.getInfringementProjectionData.name,
            });
            return { data: [] };
        }
        // Add zeros for dates that have no infringements
        rawInfringementData = this.fillInMissingDates(rawInfringementData, startDate, endDate);
        // Get existing contracts
        const rawValidContractCount = await this.getNumberOfValidVehicleContracts(accountId, dto);
        if (isNil(rawValidContractCount) || rawValidContractCount.length < 1) {
            this.logger.debug({
                message: `No contract data were found, cannot make predictions`,
                fn: this.getInfringementProjectionData.name,
            });
            return { data: [], warning: RawInfringementPredictionWarnings.noContracts };
        }
        rawInfringementData = await this.addTotalVehicleCount(rawInfringementData, rawValidContractCount);
        // If endDate is not in the future, dont make predictions
        if (moment(endDate).isBefore(moment().startOf('year'))) {
            return { data: rawInfringementData };
        }
        const infringementPredictionData = await this.calculateFutureInfringementProjections(
            rawInfringementData,
            accountId,
            dto,
            rawValidContractCount,
        );
        return infringementPredictionData;
    }

    private fillInMissingDates(raw: RawInfringementPredictionData[], startDate: string, endDate: string) {
        const numberOfMonthsNeeded = Math.ceil(moment(endDate).startOf('month').diff(moment(startDate), 'months', true));
        if (raw.length < numberOfMonthsNeeded) {
            for (let i = 1; i < numberOfMonthsNeeded; i++) {
                const date = moment(startDate).add(i, 'months').startOf('month');
                const existingData = raw.find((rawData) =>
                    moment(date)
                        .startOf('month')
                        .isSame(moment(this.getDate(rawData.offenceMonth, rawData.offenceYear)).startOf('month')),
                );
                if (!existingData) {
                    // No existing data for that date, creating zeros
                    const zeroData: RawInfringementPredictionData = {
                        offenceYear: String(moment(date).year()),
                        offenceMonth: String(moment(date).month() + 1),
                        infringementCount: 0,
                        vehicleCount: 0,
                        noContractCount: 0,
                        value: 0,
                        predicted: false,
                    };
                    raw.push(zeroData);
                }
            }
        }
        return raw;
    }

    async getInfringementData(accountId: number, dto: GetInfringementProjectionDto): Promise<RawInfringementPredictionData[]> {
        this.logger.debug({
            message: `Fetching infringement projection data from the database from ${dto.dateRange.startDate} to ${dto.dateRange.endDate}`,
            fn: this.getInfringementData.name,
        });

        let ownershipString: string = '';
        let ownershipContractString: string = '';
        if (dto.endpoint === InfringementPredictionEndpoints.User) {
            ownershipString = '"user"."accountId" = $1';
            ownershipContractString = '"infringementContract"."userId" NOT IN ($1)';
        } else if (dto.endpoint === InfringementPredictionEndpoints.Owner) {
            ownershipString = '("owner"."accountId" = $1 AND infringement.brn IS NULL)';
            ownershipContractString = '"infringementContract"."ownerId" NOT IN ($1)';
        } else if (dto.endpoint === InfringementPredictionEndpoints.Hybrid) {
            ownershipString = '"owner"."accountId" = $1 OR "user"."accountId" = $1';
            ownershipContractString = '"infringementContract"."ownerId" NOT IN ($1) AND "infringementContract"."userId" NOT IN ($1)';
        }
        const account = await Account.findByIdentifierOrId(String(accountId));

        const raw: RawInfringementPredictionData[] = await getManager().query(
            `SELECT EXTRACT(YEAR FROM "infringement"."offenceDate") AS "offenceYear",
                    EXTRACT(MONTH FROM "infringement"."offenceDate") AS "offenceMonth",
                    count(*) AS "infringementCount",
                    count(DISTINCT "infringement"."vehicleId") AS "vehicleCount",
                    count(distinct( case when (${ownershipContractString} OR "infringement"."contractId" IS NULL) then "infringement"."vehicleId" end)) AS "noContractCount",
                    count(case when "infringement"."status" = '${InfringementStatus.Paid}' then 1 else null end) AS "infringementCountPaid",
                    count(case when "infringement"."status" = '${InfringementStatus.Due}' then 1 else null end) AS "infringementCountDue",
                    count(case when "infringement"."status" = '${InfringementStatus.Outstanding}' then 1 else null end) AS "infringementCountOutstanding",
                    count(case when "infringement"."status" = '${InfringementStatus.ApprovedForPayment}' then 1 else null end) AS "infringementCountApproved",
                    count(case when "infringement"."status" = '${InfringementStatus.Closed}' then 1 else null end) AS "infringementCountClosed",
                    sum("infringement"."totalAmount") AS "value",
                    sum(case when "infringement"."status" = '${InfringementStatus.Paid}' then "infringement"."totalAmount" else null end) AS "valuePaid",
                    sum(case when "infringement"."status" = '${InfringementStatus.Due}' then "infringement"."totalAmount" else null end) AS "valueDue",
                    sum(case when "infringement"."status" = '${InfringementStatus.Outstanding}' then "infringement"."totalAmount" else null end) AS "valueOutstanding",
                    sum(case when "infringement"."status" = '${InfringementStatus.ApprovedForPayment}' then "infringement"."totalAmount" else null end) AS "valueApproved",
                    sum(case when "infringement"."status" = '${InfringementStatus.Closed}' then "infringement"."totalAmount" else null end) AS "valueClosed"
                    FROM "infringement"
                    LEFT JOIN "contract" "infringementContract" ON "infringementContract"."contractId"="infringement"."contractId"
                    LEFT JOIN "public"."nomination" "Nomination" ON "public"."infringement"."infringementId" = "Nomination"."infringementId"
                    LEFT JOIN "account" "user" ON "user"."accountId"="infringementContract"."userId"
                    LEFT JOIN "account" "owner" ON "owner"."accountId"="infringementContract"."ownerId"
                    WHERE ((${ownershipString} OR "infringement"."brn" = $2) AND ("infringement"."offenceDate" BETWEEN $3 AND $4))
                    GROUP BY "offenceMonth","offenceYear"
                    ORDER BY  "offenceMonth" DESC `,
            [accountId, account.identifier, dto.dateRange.startDate, dto.dateRange.endDate],
        );

        return raw;
    }

    async getNumberOfValidVehicleContracts(accountId: number, dto: GetInfringementProjectionDto): Promise<RawValidContractCountData[]> {
        const numberOfMonthsNeeded = Math.ceil(
            moment(dto.dateRange.endDate).endOf('year').diff(moment(dto.dateRange.startDate).startOf('month'), 'months', true),
        );
        this.logger.debug({
            message: `Getting valid vehicle contract count from ${dto.dateRange.startDate} to ${dto.dateRange.endDate} for accountId [${accountId}]`,
            fn: this.getNumberOfValidVehicleContracts.name,
        });

        let ownershipString: string = '';
        if (dto.endpoint === InfringementPredictionEndpoints.User) {
            ownershipString = '"contract"."userId" = $2';
        } else if (dto.endpoint === InfringementPredictionEndpoints.Owner) {
            ownershipString = '"contract"."ownerId" =$2';
        } else if (dto.endpoint === InfringementPredictionEndpoints.Hybrid) {
            ownershipString = '("contract"."ownerId" =$2 OR "contract"."userId" = $2)';
        }

        const raw: RawValidContractCountData[] = await getManager().query(
            `SELECT CAST("generate_series" AS VARCHAR) AS "date", count(distinct "contract"."vehicleId") AS "contractCount"
            FROM generate_series(date_trunc('month', date($1)), date($1) + interval '${numberOfMonthsNeeded} months', interval '1 month')
            LEFT JOIN "contract" ON ("contract"."startDate" <=  "generate_series" )
            WHERE (${ownershipString}
                AND "contract"."endDate" >= ( "generate_series" + '1 month')
                AND "contract"."vehicleId" IS NOT NULL)
            GROUP BY "date"`,
            [dto.dateRange.startDate, accountId],
        );
        return raw;
    }

    private addTotalVehicleCount(
        rawInfringementData: RawInfringementPredictionData[],
        rawValidContractCount: RawValidContractCountData[],
    ): RawInfringementPredictionData[] {
        rawInfringementData.forEach((data) => {
            const currentContract = rawValidContractCount.find((rawData) =>
                moment(rawData.date)
                    .startOf('month')
                    .isSame(moment(this.getDate(data.offenceMonth, data.offenceYear)).startOf('month')),
            );
            data.vehicleCountTotal = currentContract?.contractCount ? currentContract.contractCount : 0;
        });
        return rawInfringementData;
    }

    private getDate(month: string, year: string): string {
        if (+month < 10) {
            month = '0' + month;
        }
        return moment(`${year}-${month}-01`).startOf('month').toISOString();
    }

    async calculateFutureInfringementProjections(
        rawInfringementData: RawInfringementPredictionData[],
        accountId: number,
        dto: GetInfringementProjectionDto,
        rawValidContractCount: RawValidContractCountData[],
    ): Promise<InfringementProjectionDataDto> {
        const numberOfMonthsNeeded = Math.ceil(moment(dto.dateRange.endDate).endOf('year').diff(moment().startOf('month'), 'months', true));
        this.logger.debug({
            message: `Calculating infringement projection data for ${numberOfMonthsNeeded} months`,
            fn: this.calculateFutureInfringementProjections.name,
        });
        const previousStartDate = moment().startOf('month').subtract(1, 'year').toISOString();
        const previousEndDate = moment(dto.dateRange.endDate).endOf('year').subtract(1, 'year').toISOString();
        const oldDataDto: GetInfringementProjectionDto = {
            dateRange: {
                startDate: previousStartDate,
                endDate: previousEndDate,
            },
            endpoint: dto.endpoint,
        };
        const oldData = await this.getInfringementData(accountId, oldDataDto);

        if (!isNil(oldData) && oldData.length > 1) {
            // Calculating predictions using last year as a comparison
            const infringementPredictions = this.useOldDataForPrediction(oldData, rawValidContractCount);
            rawInfringementData.push(...infringementPredictions);
            return { data: rawInfringementData };
        }
        // There is no data from the previous year
        this.logger.debug({
            message: `No data is found from the previous year, using averages to make predictions`,
            fn: this.calculateFutureInfringementProjections.name,
        });
        // Calculating predictions using last year as a comparison
        const averageInfringementPredictions = this.useExistingDataAveragesForPrediction(
            rawInfringementData,
            rawValidContractCount,
            numberOfMonthsNeeded,
        );
        rawInfringementData.push(...averageInfringementPredictions);
        return { data: rawInfringementData, warning: RawInfringementPredictionWarnings.noPreviousData };
    }

    private calculateAverage(data: RawInfringementPredictionData[], property: string) {
        return Math.ceil(data.reduce((sum, rawData) => sum + +(rawData[property] ? rawData[property] : 0), 0) / data.length);
    }

    private useExistingDataAveragesForPrediction(
        allData: RawInfringementPredictionData[],
        rawValidContractCount: RawValidContractCountData[],
        numberOfMonthsNeeded: number,
    ): RawInfringementPredictionData[] {
        const infringementPredictions: RawInfringementPredictionData[] = [];

        // Find averages from the last 3 months
        const recentData = allData.slice(0, Config.get.graphing.averageMonthsForProjection);
        const averageInfringementCount = this.calculateAverage(recentData, 'infringementCount');
        const averageVehicleCount = this.calculateAverage(recentData, 'vehicleCount');
        const averageVehicleCountTotal = this.calculateAverage(recentData, 'vehicleCountTotal');
        const averageValue = this.calculateAverage(recentData, 'value');

        // Make calculation for the number of required months
        for (let i = 0; i < numberOfMonthsNeeded; i++) {
            const currentDate = moment().add(i, 'months').startOf('month');
            const currentContract = rawValidContractCount.find((rawData) => moment(rawData?.date).startOf('month').isSame(currentDate));
            const currentVehicleCount = currentContract?.contractCount ? currentContract.contractCount : 0;
            const prediction: RawInfringementPredictionData = {
                offenceYear: String(moment(currentContract?.date).year()),
                offenceMonth: String(moment(currentContract?.date).month() + 1),
                infringementCount: this.calculatePrediction(averageInfringementCount, averageVehicleCount, currentVehicleCount, false),
                vehicleCount: this.calculatePrediction(averageVehicleCount, averageVehicleCountTotal, currentVehicleCount, false),
                value: this.calculatePrediction(averageValue, averageVehicleCount, currentVehicleCount, true),
                predicted: true,
                noContractCount: 0,
                vehicleCountTotal: currentVehicleCount,
            };
            infringementPredictions.push(prediction);
        }
        return infringementPredictions;
    }

    private useOldDataForPrediction(
        oldData: RawInfringementPredictionData[],
        rawValidContractCount: RawValidContractCountData[],
    ): RawInfringementPredictionData[] {
        const infringementPredictions: RawInfringementPredictionData[] = [];
        // Compare to all vehicles not just ones there
        oldData.forEach((oldDate) => {
            let previousVehicleCount = oldDate.vehicleCountTotal ? oldDate.vehicleCountTotal : 0;
            if (!previousVehicleCount) {
                const previousContract = rawValidContractCount.find((rawData) =>
                    moment(rawData.date)
                        .startOf('month')
                        .isSame(moment(this.getDate(oldDate.offenceMonth, oldDate.offenceYear)).startOf('month')),
                );
                previousVehicleCount = previousContract?.contractCount ? previousContract.contractCount : 0;
            }
            const currentContract = rawValidContractCount.find((rawData) =>
                moment(rawData.date)
                    .startOf('month')
                    .isSame(moment(this.getDate(oldDate.offenceMonth, oldDate.offenceYear + 1)).startOf('month')),
            );
            const currentVehicleCount = currentContract?.contractCount ? currentContract.contractCount : 0;
            const prediction: RawInfringementPredictionData = {
                offenceYear: oldDate.offenceYear + 1,
                offenceMonth: oldDate.offenceMonth,
                infringementCount: this.calculatePrediction(oldDate.infringementCount, previousVehicleCount, currentVehicleCount, false),
                vehicleCount: this.calculatePrediction(oldDate.vehicleCount, previousVehicleCount, currentVehicleCount, false),
                value: this.calculatePrediction(oldDate.value, previousVehicleCount, currentVehicleCount, true),
                predicted: true,
                noContractCount: 0,
                vehicleCountTotal: currentVehicleCount,
            };
            infringementPredictions.push(prediction);
        });
        return infringementPredictions;
    }

    private calculatePrediction(
        previousAmount: number,
        previousVehicleCount: number,
        currentVehicleCount: number,
        percentageIncrease: boolean,
    ): number {
        if (currentVehicleCount === 0) {
            // No existing contracts are found for that period, so no infringement can occur
            return 0;
        }
        if (previousVehicleCount === 0) {
            // No existing contracts were found for that period, so use previous amount
            return percentageIncrease ? Math.ceil(previousAmount * Config.get.graphing.projectionIncrease) : previousAmount;
        }
        // Calculation = Previous total / previous vehicle count * current vehicle count * increase percentage
        const calculatedAmount = Math.ceil((previousAmount / previousVehicleCount) * currentVehicleCount);
        return percentageIncrease ? Math.ceil(calculatedAmount * Config.get.graphing.projectionIncrease) : calculatedAmount;
    }
}
