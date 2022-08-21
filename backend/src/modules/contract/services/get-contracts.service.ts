import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract } from '@entities';

@Injectable()
export class GetContractsService {
    constructor(private logger: Logger) {}

    async getContracts(): Promise<Contract[]> {
        this.logger.log({ message: `Getting Vehicle Contracts`, detail: null, fn: this.getContracts.name });
        const contracts = await Contract.find();
        this.logger.log({ message: `Found Vehicle Contracts, length: `, detail: contracts.length, fn: this.getContracts.name });
        return contracts;
    }

    async getContractsForVehicle(vehicleId: number): Promise<Contract[]> {
        this.logger.log({ message: `Getting Vehicle Contracts for vehicle`, detail: vehicleId, fn: this.getContracts.name });
        const contracts = await Contract.findWithMinimalRelations()
            .andWhere('vehicle.vehicleId = :vehicleId', { vehicleId })
            .orderBy('contract.endDate', 'DESC')
            .getMany();
        this.logger.log({ message: `Found Vehicle Contracts, length: `, detail: contracts.length, fn: this.getContracts.name });
        return contracts;
    }
}
