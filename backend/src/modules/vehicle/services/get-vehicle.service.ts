import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Vehicle } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetVehicleService {
    constructor(private logger: Logger) {}

    @Transactional()
    async getVehicle(vehicleId: number): Promise<Vehicle> {
        this.logger.log({ message: `Getting Vehicle with id: `, detail: vehicleId, fn: this.getVehicle.name });
        const vehicle = await Vehicle.findWithMinimalRelations().andWhere('vehicle.vehicleId = :vehicleId', { vehicleId }).getOne();
        if (!vehicle) {
            throw new BadRequestException({ message: ERROR_CODES.E049_CouldNotFindVehicle.message({ vehicleId }) });
        }
        this.logger.log({ message: `Found Vehicle with id: `, detail: vehicle.vehicleId, fn: this.getVehicle.name });
        return vehicle;
    }
}
