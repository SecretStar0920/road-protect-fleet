import { Injectable } from '@nestjs/common';
import { Account, Contract, Infringement, Vehicle } from '@entities';
import { Brackets } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { DateRangeDto } from '@modules/graphing/controllers/date-range.dto';
import { isNil } from 'lodash';

export enum VehicleEndpoints {
    Own = 'Own',
    Leasing = 'Leasing',
    All = 'All',
}

@Injectable()
export class HomeReportingQueryService {
    generateInfringementBaseQuery(account: Account, dates?: DateRangeDto): SelectQueryBuilder<Infringement> {
        const infringementBaseQuery = this.generateInfringementBaseQueryNoDates(account);
        return this.addInfringementOffenceDates(infringementBaseQuery, dates);
    }

    generateInfringementBaseQueryNoDates(account: Account): SelectQueryBuilder<Infringement> {
        const infringementBaseQuery = Infringement.createQueryBuilder('infringement')
            .leftJoin('infringement.vehicle', 'vehicle')
            .leftJoin('infringement.nomination', 'nomination')
            .leftJoin('infringement.contract', 'infringementContract')
            .leftJoin('infringementContract.user', 'user')
            .leftJoin('infringementContract.owner', 'owner')
            .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .leftJoin('currentLeaseContract.user', 'vehicle_user')
            .leftJoin('currentLeaseContract.owner', 'vehicle_owner')
            .leftJoin('infringement.issuer', 'issuer');

        // ownership
        infringementBaseQuery
            // All
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :userId', { userId: account.accountId });
                    qb.orWhere('owner.accountId = :ownerId', { ownerId: account.accountId });
                    qb.orWhere('infringement.brn = :brn', { brn: account.identifier });
                }),
            );
        return infringementBaseQuery;
    }

    addInfringementOffenceDates(baseQuery: SelectQueryBuilder<Infringement>, dates?: DateRangeDto): SelectQueryBuilder<Infringement> {
        if (!isNil(dates?.startDate)) {
            // offence date is within specified date range
            baseQuery.andWhere('infringement.offenceDate >= :startDate', {
                startDate: dates.startDate,
            });
        }
        if (!isNil(dates?.endDate)) {
            // offence date is within specified date range
            baseQuery.andWhere('infringement.offenceDate < :endDate', {
                endDate: dates.endDate,
            });
        }
        return baseQuery;
    }

    generateContractBaseQuery(account: Account): SelectQueryBuilder<Contract> {
        return Contract.findWithMinimalRelations().andWhere(
            new Brackets((qb1) => {
                qb1.andWhere('user.accountId = :accountId', { accountId: account.accountId });
                qb1.orWhere('owner.accountId = :accountId', { accountId: account.accountId });
            }),
        );
    }

    generateVehicleBaseQuery(account: Account, via: VehicleEndpoints): SelectQueryBuilder<Vehicle> {
        const baseQuery = Vehicle.findWithMinimalRelations().leftJoinAndSelect('infringement.contract', 'infringementContract');
        // Ownership
        if (via === VehicleEndpoints.Own) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseOwner.accountId = :id', { id: account.accountId });
                    qb.orWhere('owner.accountId = :id', { id: account.accountId });
                }),
            );
        } else if (via === VehicleEndpoints.Leasing) {
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseUser.accountId = :id', { id: account.accountId });
                }),
            );
        } else {
            // All
            baseQuery.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseUser.accountId = :id', { id: account.accountId });
                    qb.orWhere('leaseOwner.accountId = :id', { id: account.accountId });
                    qb.orWhere('owner.accountId = :id', { id: account.accountId });
                }),
            );
        }
        return baseQuery;
    }
}
