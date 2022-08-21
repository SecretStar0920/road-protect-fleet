import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Vehicle } from '@entities';
import { Brackets } from 'typeorm';

@Injectable()
export class GetVehiclesForAccountService {
    constructor(private logger: Logger) {}

    async getVehiclesForAccount(accountId: number): Promise<Vehicle[]> {
        this.logger.log({ message: `Getting Vehicles for account`, detail: accountId, fn: this.getVehiclesForAccount.name });
        const vehicles = await Vehicle.findWithMinimalRelations()
            .andWhere(
                new Brackets((qb) => {
                    qb.andWhere('user.accountId = :id', { id: accountId });
                    qb.orWhere('owner.accountId = :id', { id: accountId });
                }),
            )
            .getMany();
        this.logger.log({ message: `Found Vehicles, length: `, detail: vehicles.length, fn: this.getVehiclesForAccount.name });
        return vehicles;
    }
}
