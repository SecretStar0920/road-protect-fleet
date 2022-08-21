import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Vehicle } from '@entities';

@Injectable()
export class GetVehiclesService {
    constructor(private logger: Logger) {}

    async getVehicles(): Promise<Vehicle[]> {
        this.logger.log({ message: `Getting Vehicles`, detail: null, fn: this.getVehicles.name });
        const vehicles = await Vehicle.findWithMinimalRelations().getMany();
        this.logger.log({ message: `Found Vehicles, length: `, detail: vehicles.length, fn: this.getVehicles.name });
        return vehicles;
    }
}
