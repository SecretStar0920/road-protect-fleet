import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ReportingDataDto } from '@modules/shared/dtos/reporting-data.dto';
import { Infringement } from '@entities';
import { Brackets } from 'typeorm';

@Injectable()
export class AccountLeadingVehiclesReportingService {
    constructor(private logger: Logger) {}

    async getLeadingVehicleData(accountId: number): Promise<ReportingDataDto> {
        const data: ReportingDataDto = { data: [] };

        const query: {
            vehicleId: number;
            registration: string;
            infringements: number;
            amount: string;
        }[] = await Infringement.createQueryBuilder('infringement')
            .leftJoinAndSelect('infringement.vehicle', 'vehicle')
            .innerJoin('infringement.contract', 'contract')
            .leftJoin('contract.user', 'user')
            .addSelect(['user.name', 'user.accountId'])
            .leftJoin('contract.owner', 'owner')
            .addSelect(['owner.name', 'owner.accountId'])
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :id', { id: accountId });
                    qb.orWhere('owner.accountId = :id', { id: accountId });
                }),
            )
            .select('count(infringement.infringementId)', 'infringements')
            .addSelect('sum(infringement.amountDue)', 'amount')
            .addSelect('vehicle.vehicleId', 'vehicleId')
            .addSelect('vehicle.registration', 'registration')
            .groupBy('vehicle.registration')
            .addGroupBy('vehicle.vehicleId')
            .orderBy('amount', 'DESC')
            .limit(10)
            .getRawMany();

        data.data = query.map((item) => {
            return {
                name: item.registration,
                value: item.amount,
                extra: {
                    vehicle: {
                        registration: item.registration,
                        vehicleId: item.vehicleId,
                    },
                    count: item.infringements,
                },
            };
        });

        return data;
    }
}
