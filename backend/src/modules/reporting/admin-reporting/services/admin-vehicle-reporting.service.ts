import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { Vehicle } from '@entities';
import { Brackets } from 'typeorm';

@Injectable()
export class AdminVehicleReportingService {
    constructor(private logger: Logger) {}

    async getVehicleData(): Promise<ReportingDataDto> {
        const query = Vehicle.createQueryBuilder('vehicle').getRawMany();

        const total = await Vehicle.count();
        const owned = await Vehicle.createQueryBuilder('vehicle')
            .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .leftJoin('currentLeaseContract.owner', 'leaseOwner')
            .leftJoin('currentLeaseContract.user', 'leaseUser')
            .leftJoin('vehicle.currentOwnershipContract', 'currentOwnershipContract')
            .leftJoin('currentOwnershipContract.owner', 'owner')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseOwner.accountId IS NOT NULL');
                    qb.orWhere('owner.accountId IS NOT NULL');
                }),
            )
            .getCount();
        const used = await Vehicle.createQueryBuilder('vehicle')
            .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .leftJoin('currentLeaseContract.owner', 'leaseOwner')
            .leftJoin('currentLeaseContract.user', 'leaseUser')
            .leftJoin('vehicle.currentOwnershipContract', 'currentOwnershipContract')
            .leftJoin('currentOwnershipContract.owner', 'owner')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseUser.accountId IS NOT NULL');
                }),
            )
            .getCount();
        const withInfringements = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.infringements', 'infringements')
            .getCount();
        const hasLease = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .getCount();
        const hasOwnership = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.currentOwnershipContract', 'currentContract')
            .getCount();

        const data: ReportingDataDto = {
            data: [
                {
                    name: 'Total',
                    value: total,
                },
                {
                    name: 'Owned',
                    value: owned,
                },
                {
                    name: 'Used',
                    value: used,
                },
                {
                    name: 'No Current Lease',
                    value: total - hasLease,
                },
                {
                    name: 'No Current Ownership',
                    value: total - hasOwnership,
                },
                {
                    name: 'With Infringements',
                    value: withInfringements,
                },
            ],
        };
        return data;
    }
}
