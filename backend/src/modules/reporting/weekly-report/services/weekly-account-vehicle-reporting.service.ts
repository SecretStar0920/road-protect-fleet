import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { Vehicle } from '@entities';
import { Brackets } from 'typeorm';

@Injectable()
export class WeeklyAccountVehicleReportingService {
    constructor(private logger: Logger) {}

    async getVehicleData(accountId: number): Promise<ReportingDataDto> {
        const data: ReportingDataDto = { data: [] };

        const owned = await Vehicle.createQueryBuilder('vehicle')
            .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .leftJoin('currentLeaseContract.owner', 'leaseOwner')
            .leftJoin('currentLeaseContract.user', 'leaseUser')
            .leftJoin('vehicle.currentOwnershipContract', 'currentOwnershipContract')
            .leftJoin('currentOwnershipContract.owner', 'owner')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseOwner.accountId = :id', { id: accountId });
                    qb.orWhere('owner.accountId = :id', { id: accountId });
                }),
            )
            .select(['vehicle.registration', 'vehicle.vehicleId'])
            .getMany();

        const using = await Vehicle.createQueryBuilder('vehicle')
            .innerJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .innerJoin('currentLeaseContract.user', 'account', 'account.accountId = :id', { id: accountId })
            .select(['vehicle.registration', 'vehicle.vehicleId'])
            .getMany();

        const total = await Vehicle.createQueryBuilder('vehicle')
            .leftJoin('vehicle.currentLeaseContract', 'currentLeaseContract')
            .leftJoin('currentLeaseContract.owner', 'leaseOwner')
            .leftJoin('currentLeaseContract.user', 'leaseUser')
            .leftJoin('vehicle.currentOwnershipContract', 'currentOwnershipContract')
            .leftJoin('currentOwnershipContract.owner', 'owner')
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('leaseOwner.accountId = :id', { id: accountId });
                    qb.orWhere('leaseUser.accountId = :id', { id: accountId });
                    qb.orWhere('owner.accountId = :id', { id: accountId });
                }),
            )
            .select(['vehicle.registration', 'vehicle.vehicleId'])
            .getMany();

        if (total.length > 0) {
            data.data.push({
                name: 'Total',
                value: total.length,
                extra: {
                    vehicles: total,
                },
            });
        }

        if (owned.length > 0) {
            data.data.push({
                name: 'Owned',
                value: owned.length,
                extra: {
                    vehicles: owned,
                },
            });
        }

        if (using.length > 0) {
            data.data.push({
                name: 'Using (Fleet)',
                value: using.length,
                extra: {
                    vehicles: using,
                },
            });
        }

        return data;
    }
}
