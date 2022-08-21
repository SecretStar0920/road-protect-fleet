import { Injectable } from '@nestjs/common';
import { Account, Vehicle } from '@entities';
import { Logger } from '@logger';
import {
    GetInfringementProjectionDto,
    InfringementPredictionEndpoints,
} from '@modules/graphing/controllers/get-infringement-projection.dto';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { Brackets } from 'typeorm';

@Injectable()
export class InfringementProjectionQueryService {
    constructor(private logger: Logger) {}

    getVehiclesWithValidContracts(
        baseQuery: SelectQueryBuilder<Vehicle>,
        accountId: number,
        dto: GetInfringementProjectionDto,
    ): SelectQueryBuilder<Vehicle> {
        this.logger.debug({ message: 'Finding infringement projection information', fn: this.getVehiclesWithValidContracts.name });
        // Account
        if (dto.endpoint === InfringementPredictionEndpoints.Owner) {
            baseQuery.andWhere('contracts_owner.accountId = :accountId', { accountId });
        } else if (dto.endpoint === InfringementPredictionEndpoints.User) {
            baseQuery.andWhere('contracts_user.accountId = :accountId', { accountId });
        } else if (dto.endpoint === InfringementPredictionEndpoints.Hybrid) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('contracts_owner.accountId = :accountId', { accountId });
                    qb.orWhere('contracts_user.accountId = :accountId', { accountId });
                }),
            );
        }
        // Contract was valid within the date range
        baseQuery
            .andWhere('contracts.startDate < :startDate', { startDate: dto.dateRange.startDate })
            .andWhere('contracts.endDate > :endDate', { endDate: dto.dateRange.endDate });
        return baseQuery;
    }

    async getVehiclesWithoutContracts(
        baseQuery: SelectQueryBuilder<Vehicle>,
        accountId: number,
        dto: GetInfringementProjectionDto,
    ): Promise<SelectQueryBuilder<Vehicle>> {
        this.logger.debug({ message: 'Finding infringement projection information', fn: this.getVehiclesWithoutContracts.name });
        // Account
        if (dto.endpoint === InfringementPredictionEndpoints.Owner) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('contracts_owner.accountId NOT IN (:accountId)', { accountId });
                    qb.orWhere('infringement."contractId" IS NULL');
                }),
            );
        } else if (dto.endpoint === InfringementPredictionEndpoints.User) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('contracts_user.accountId NOT IN (:accountId)', { accountId });
                    qb.orWhere('infringement."contractId" IS NULL');
                }),
            );
        } else if (dto.endpoint === InfringementPredictionEndpoints.Hybrid) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('contracts_user.accountId NOT IN (:accountId)', { accountId });
                    qb.andWhere('contracts_owner.accountId NOT IN (:accountId)', { accountId });
                    qb.orWhere('infringement."contractId" IS NULL');
                }),
            );
        }
        // Linked to current account
        const account = await Account.findByIdentifierOrId(String(accountId));
        baseQuery.andWhere('infringement.brn = :identifier', { identifier: account.identifier });
        baseQuery.andWhere('infringement.offenceDate BETWEEN :startDate AND :endDate', {
            startDate: dto.dateRange.startDate,
            endDate: dto.dateRange.endDate,
        });
        return baseQuery;
    }

    getVehiclesWithoutInfringements(
        baseQuery: SelectQueryBuilder<Vehicle>,
        accountId: number,
        dto: GetInfringementProjectionDto,
    ): SelectQueryBuilder<Vehicle> {
        this.logger.debug({ message: 'Finding infringement projection information', fn: this.getVehiclesWithoutInfringements.name });
        // Account
        if (dto.endpoint === InfringementPredictionEndpoints.Owner) {
            baseQuery.andWhere('contracts_owner.accountId = :accountId', { accountId });
        } else if (dto.endpoint === InfringementPredictionEndpoints.User) {
            baseQuery.andWhere('contracts_user.accountId = :accountId', { accountId });
        } else if (dto.endpoint === InfringementPredictionEndpoints.Hybrid) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('contracts_owner.accountId = :accountId', { accountId });
                    qb.orWhere('contracts_user.accountId = :accountId', { accountId });
                }),
            );
        }
        // Contract was valid within the date range
        baseQuery
            .andWhere('contracts.startDate < :startDate', { startDate: dto.dateRange.startDate })
            .andWhere('contracts.endDate > :endDate', { endDate: dto.dateRange.endDate });
        // offence date is outside the specified dates or infringement does not exist
        baseQuery.andWhere(
            '"vehicle"."registration" NOT IN' +
                '( SELECT "vehicle"."registration"  FROM "vehicle"' +
                'LEFT JOIN "infringement" "infringement"  ON "infringement"."vehicleId" = "vehicle"."vehicleId" ' +
                'WHERE "infringement"."offenceDate" BETWEEN :startDate AND :endDate )',
            { startDate: dto.dateRange.startDate, endDate: dto.dateRange.endDate },
        );
        return baseQuery;
    }

    async getVehiclesWithInfringements(
        baseQuery: SelectQueryBuilder<Vehicle>,
        accountId: number,
        dto: GetInfringementProjectionDto,
    ): Promise<SelectQueryBuilder<Vehicle>> {
        this.logger.debug({ message: 'Finding infringement projection information', fn: this.getVehiclesWithInfringements.name });
        // Account
        const account = await Account.findByIdentifierOrId(String(accountId));
        if (dto.endpoint === InfringementPredictionEndpoints.Owner) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere(
                        new Brackets((qb1) => {
                            return qb1
                                .andWhere('"infringementContract"."ownerId" = :accountId', { accountId })
                                .andWhere('infringement.brn IS NULL');
                        }),
                    );
                    qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                }),
            );
        } else if (dto.endpoint === InfringementPredictionEndpoints.User) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('"infringementContract"."userId" = :accountId', { accountId });
                    qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                }),
            );
        } else if (dto.endpoint === InfringementPredictionEndpoints.Hybrid) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.orWhere('"infringementContract"."userId" = :accountId', { accountId });
                    qb.orWhere('"infringementContract"."ownerId" = :accountId', { accountId });
                    qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                }),
            );
        }
        // Contract was valid within the date range or no contracts
        baseQuery.andWhere(
            new Brackets((qb) => {
                qb.andWhere(
                    new Brackets((qb1) => {
                        // Dates
                        return qb1
                            .andWhere('contracts.startDate < :startDate', { startDate: dto.dateRange.startDate })
                            .andWhere('contracts.endDate > :endDate', { endDate: dto.dateRange.endDate });
                    }),
                );
                qb.orWhere('contracts.contractId IS NULL');
            }),
        );
        // Infringement within the date range
        baseQuery.andWhere('infringement.offenceDate BETWEEN :startDate AND :endDate', {
            startDate: dto.dateRange.startDate,
            endDate: dto.dateRange.endDate,
        });
        return baseQuery;
    }
}
