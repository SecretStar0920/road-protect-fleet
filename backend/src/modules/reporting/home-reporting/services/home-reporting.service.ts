import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { SingleSeries } from '@modules/shared/dtos/chart-data.model';
import { Account, AccountUser, ContractStatus, InfringementStatus, Issuer, Vehicle } from '@entities';
import { forEach } from 'lodash';
import { IsDefined } from 'class-validator';
import { DateRangeDto } from '@modules/graphing/controllers/date-range.dto';
import { HomeReportingQueryService, VehicleEndpoints } from '@modules/reporting/home-reporting/services/home-reporting-query.service';
import * as moment from 'moment';
import { Config } from '@config/config';
import { InfringementVerificationProvider } from '@config/infringement';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { Brackets } from 'typeorm';
import { isNil } from 'lodash';

export class HomeReportingDataDto {
    @IsDefined()
    totals: SingleSeries;
    @IsDefined()
    leadingIssuer: {
        count: string;
        name: string;
    };
    @IsDefined()
    leadingVehicle: {
        count: string;
        registration: string;
    };
    @IsDefined()
    nominationStatus: SingleSeries;
    @IsDefined()
    costs: SingleSeries;
    @IsDefined()
    infringementStatus: SingleSeries;
    @IsDefined()
    infringementOutstandingSoon: SingleSeries;
    @IsDefined()
    contractStatus: SingleSeries;
    @IsDefined()
    vehicles: SingleSeries;
    @IsDefined()
    issuers: SingleSeries;
    @IsDefined()
    issuerTotal: SingleSeries;
}
export class HomeReportingTotalDataDto {
    @IsDefined()
    totals: SingleSeries;
    @IsDefined()
    leadingVehicle: {
        count: string;
        registration: string;
    };
}

export class HomeReportingCostDataDto {
    @IsDefined()
    costs: SingleSeries;
}

export class HomeReportingInfringementDataDto {
    @IsDefined()
    nominationStatus: SingleSeries;
    @IsDefined()
    infringementStatus: SingleSeries;
    @IsDefined()
    infringementOutstandingSoon: SingleSeries;
}

export class HomeReportingContractDataDto {
    @IsDefined()
    contractStatus: SingleSeries;
}

export class HomeReportingVehicleDataDto {
    @IsDefined()
    vehicles: SingleSeries;
}

export class HomeReportingIssuerDataDto {
    @IsDefined()
    issuerTotal: SingleSeries;
    @IsDefined()
    issuers: SingleSeries;
    @IsDefined()
    leadingIssuer: {
        count: string;
        name: string;
    };
}

@Injectable()
export class HomeReportingService {
    private _topNumberOfElements = 5;
    constructor(private logger: Logger, private accountReportingQueryService: HomeReportingQueryService) {}

    async getAllHomeReportingData(accountId: number, dates: DateRangeDto): Promise<HomeReportingDataDto> {
        if (!dates) {
            throw new BadRequestException({ message: ERROR_CODES.E169_InvalidDates.message() });
        }
        this.logger.debug({ message: 'Finding account data', detail: { accountId, dates }, fn: this.getAllHomeReportingData.name });
        const account = await Account.findByIdentifierOrId(String(accountId));

        let data: HomeReportingDataDto;
        const totalsData = await this.getTotalsData(account, dates);
        const costs = await this.getCostData(account, dates);
        const infringementStatuses = await this.getInfringementStatuses(account, dates);
        const contractStatuses = await this.getContractStatuses(account);
        const vehicles = await this.getVehicles(account);
        const issuers = await this.getIssuers(account, dates);
        data = { ...totalsData, ...costs, ...infringementStatuses, ...contractStatuses, ...vehicles, ...issuers };


        return data;
    }

    async getIssuers(account: Account, dates: DateRangeDto): Promise<HomeReportingIssuerDataDto> {
        const rawIssuerTotal = await this.findIssuers(account, dates);
        if (!rawIssuerTotal || rawIssuerTotal.length < 1) {
            return { issuerTotal: undefined, leadingIssuer: undefined, issuers: undefined };
        }
        const leadingIssuer = rawIssuerTotal.reduce((total, current) => {
            return {
                count: String(Number(total.count) > Number(current.count) ? total.count : current.count),
                name: Number(total.count) > Number(current.count) ? total.name : current.name,
            };
        });


        // Check if police issuer is included, else add it
        const policeIssuer = await Issuer.findWithMinimalRelations()
            .andWhere(`issuer."integrationDetails"->>'verificationProvider' = :provider`, {
                provider: InfringementVerificationProvider.Police,
            })
            .getOne();

        let sortedIssuers = rawIssuerTotal
            .sort((a, b) => (Number(a.count) < Number(b.count) ? 1 : -1))
            .slice(0, this._topNumberOfElements);

        if (!!policeIssuer) {
            let policeInformation = rawIssuerTotal.find((issuer) => issuer.name === policeIssuer.name);
            if (!policeInformation) {
                // There are no police issued infringements therefore add an empty one
                policeInformation = {
                    name: policeIssuer.name,
                    count: '0',
                };
            }
            if (!sortedIssuers.find((issuer) => issuer.name === policeIssuer.name)) {
                // If police is not in the top 5, then replace the lowest with police
                sortedIssuers = sortedIssuers.slice(0, this._topNumberOfElements - 1);
                sortedIssuers.push(policeInformation);
            }
        }
        const issuers: SingleSeries = [];
        if (sortedIssuers.length > 0) {
            sortedIssuers.map((issuer) => {
                issuers.push({
                    name: issuer.name,
                    value: Number(issuer.count).toFixed(),
                });
            });
        }

        console.log('Home', rawIssuerTotal)

        const issuerTotal: SingleSeries = [{ name: 'issuerTotal', value: rawIssuerTotal.length }];
        return { leadingIssuer, issuers, issuerTotal };
    }

    async getVehicles(account: Account): Promise<HomeReportingVehicleDataDto> {
        const owned = await this.accountReportingQueryService
            .generateVehicleBaseQuery(account, VehicleEndpoints.Own)
            .select(['count(DISTINCT vehicle.registration) AS "ownedVehicles"'])
            .getRawOne<{ ownedVehicles: string }>();
        const leased = await this.accountReportingQueryService
            .generateVehicleBaseQuery(account, VehicleEndpoints.Leasing)
            .select(['count(DISTINCT vehicle.registration) AS "leasedVehicles"'])
            .getRawOne<{ leasedVehicles: string }>();
        const all = await this.accountReportingQueryService
            .generateVehicleBaseQuery(account, VehicleEndpoints.All)
            .select(['count(DISTINCT vehicle.registration) AS "allVehicles"'])
            .getRawOne<{ allVehicles: string }>();
        const vehicles: SingleSeries = [];
        const raw = { ...owned, ...leased, ...all };
        Object.keys(raw).map((key) => {
            vehicles.push({
                name: key,
                value: Number(raw[key]).toFixed(),
            });
        });
        return { vehicles };
    }

    async getContractStatuses(account: Account): Promise<HomeReportingContractDataDto> {
        const rawStatuses = await this.accountReportingQueryService
            .generateContractBaseQuery(account)
            .select(['count(*)', '"contract".status'])
            .groupBy('contract.status')
            .getRawMany<{ count: string; status: string }>();
        const contractStatus: SingleSeries = [];
        Object.values(ContractStatus).map((status) => {
            const value = rawStatuses.find((rawStatus) => rawStatus.status === status);
            contractStatus.push({
                name: status,
                value: value ? Number(value.count).toFixed() : Number(0).toFixed(),
            });
        });
        return { contractStatus };
    }

    async getInfringementStatuses(account: Account, dates: DateRangeDto): Promise<HomeReportingInfringementDataDto> {
        const nominationStatus = await this.findNominationStatuses(account, dates);
        const infringementStatus = await this.findInfringementStatuses(account, dates);
        const infringementOutstandingSoon: SingleSeries = [];
        const outstandingSoon = await this.findInfringementOutstandingSoon(account, dates);
        forEach(outstandingSoon, (value, key) => {
            infringementOutstandingSoon.push({
                name: key,
                value: Number(value).toFixed(),
            });
        });
        return { infringementStatus, nominationStatus, infringementOutstandingSoon };
    }

    async getCostData(account: Account, dates: DateRangeDto): Promise<HomeReportingCostDataDto> {
        const costs: SingleSeries = [];
        const infringementCost = await this.findInfringementCosts(account, dates);
        forEach(infringementCost, (value, key) => {
            costs.push({
                name: key,
                value: Number(value).toFixed(),
            });
        });
        return { costs };
    }

    async getTotalsData(account: Account, dates: DateRangeDto): Promise<HomeReportingTotalDataDto> {
        this.logger.debug({
            message: 'Finding account data',
            detail: { accountId: account.accountId, dates },
            fn: this.getTotalsData.name,
        });
        const totals: SingleSeries = [];

        // Find totals
        const infringementTotal = await this.findTotalInfringements(account, dates);
        const { vehicleTotal, leadingVehicle } = await this.findTotalVehicles(account);
        const contractTotal = await this.findTotalContracts(account);
        const userTotal = await this.findTotalUsers(account);

        // Format into ngx-chars format
        const allTotals = { ...infringementTotal, ...vehicleTotal, ...contractTotal, ...userTotal };
        forEach(allTotals, (value, key) => {
            totals.push({
                name: key,
                value: Number(value).toFixed(),
            });
        });
        return { totals, leadingVehicle };
    }

    async findInfringementOutstandingSoon(account: Account, dates) {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQueryNoDates(account);
        infringementBaseQuery.andWhere('infringement.status in (:...statuses)', {
            statuses: [InfringementStatus.Due, InfringementStatus.ApprovedForPayment],
        });
        if (!!dates.endDate) {
            infringementBaseQuery.andWhere('infringement.latestPaymentDate BETWEEN :startDate AND :endDate', {
                startDate: dates.endDate,
                endDate: moment(dates.endDate).add(Config.get.infringement.defaultPaymentDays, 'days').toISOString(),
            });
        }
        return await infringementBaseQuery.select(['count(*) as "outstandingSoon"']).getRawOne<{ outstandingSoon: string }>();
    }

    async findInfringementStatuses(account: Account, dates): Promise<SingleSeries> {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, dates);
        const rawStatuses = await infringementBaseQuery
            .select(['count(*)', '"infringement".status'])
            .groupBy('infringement.status')
            .getRawMany<{ count: string; status: string }>();
        const statuses: SingleSeries = [];
        Object.values(InfringementStatus).map((status) => {
            const value = rawStatuses.find((rawStatus) => rawStatus.status === status);
            statuses.push({
                name: status,
                value: value ? Number(value.count).toFixed() : Number(0).toFixed(),
            });
        });
        return statuses;
    }

    async findNominationStatuses(account: Account, dates): Promise<SingleSeries> {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, dates);
        const rawStatues = await infringementBaseQuery
            .select(['count(*)', '"nomination".status'])
            .groupBy('nomination.status')
            .getRawMany<{ count: string; status: string }>();
        const statuses: SingleSeries = [];
        rawStatues.map((status) => {
            statuses.push({
                name: status.status,
                value: Number(status.count).toFixed(),
            });
        });
        return statuses;
    }

    async findInfringementCosts(account: Account, dates) {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, dates);
        return await infringementBaseQuery
            .select([
                'sum(infringement."amountDue") as "amountDue"',
                'sum(infringement."penaltyAmount") as "penaltyAmount"',
                'sum(infringement."totalPayments") as "totalPayments"',
            ])
            .getRawOne<{ amountDue: string; penaltyAmount: string; totalPayments: string }>();
    }

    async findTotalInfringements(account: Account, dates) {
        // Generate base queries
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, dates);
        return await infringementBaseQuery
            .select(['count(*) AS "infringementCount"', 'avg("originalAmount") AS "infringementAvgCost"'])
            .getRawOne<{ infringementCount: string; infringementAvgCost: string }>();
    }

    async findTotalVehicles(account: Account) {
        const rawVehicleTotal = await Vehicle.findWithMinimalRelations()
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseUser.accountId = :id', { id: account.accountId });
                    qb.orWhere('leaseOwner.accountId = :id', { id: account.accountId });
                    qb.orWhere('owner.accountId = :id', { id: account.accountId });
                }),
            )
            .select(['count(infringement.infringementId)', 'vehicle.registration AS registration'])
            .groupBy('vehicle.registration')
            .getRawMany<{ count: string; registration: string }>();
        if (!rawVehicleTotal || rawVehicleTotal.length < 1) {
            return { vehicleTotal: undefined, leadingVehicle: undefined };
        }
        const reducedVehicleTotal = rawVehicleTotal.reduce((total, current, index) => {
            return {
                count: String(Number(total.count) + Number(current.count)),
                registration: String(index + 1),
            };
        });
        const vehicleTotal = {
            vehicleCount: rawVehicleTotal.length === 1 ? 1 : reducedVehicleTotal.registration,
            vehicleAvgInfringement: (Number(reducedVehicleTotal.count) / Number(rawVehicleTotal.length)).toFixed(2),
        };
        const leadingVehicle = rawVehicleTotal.reduce((total, current, index) => {
            return {
                count: String(Number(total.count) > Number(current.count) ? total.count : current.count),
                registration: Number(total.count) > Number(current.count) ? total.registration : current.registration,
            };
        });
        return { vehicleTotal, leadingVehicle };
    }

    async findTotalContracts(account: Account) {
        return await this.accountReportingQueryService
            .generateContractBaseQuery(account)
            .select(['count(*) AS "contractCount"'])
            .getRawOne<{ contractCount: string }>();
    }

    async findTotalUsers(account: Account) {
        return await AccountUser.findWithMinimalRelations()
            .andWhere('account.accountId = :accountId', { accountId: account.accountId })
            .andWhere('accountUser.hidden = :hidden', { hidden: false })
            .select(['count(*) AS "userCount"'])
            .getRawOne<{ userCount: string }>();
    }

    async findIssuers(account: Account, dates: DateRangeDto) {
        const infringementBaseQuery = this.accountReportingQueryService.generateInfringementBaseQuery(account, dates);
        const rawIssuerTotal = await infringementBaseQuery
            .select(['count(infringement."infringementId") AS "count"', 'issuer."name" AS "name"'])
            .groupBy('issuer."name"')
            .getRawMany<{ count: string; name: string }>();
        return rawIssuerTotal;
    }
}
