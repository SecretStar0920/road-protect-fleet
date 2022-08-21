import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Log, LogPriority, LogType, Vehicle } from '@entities';
import { UpdateVehicleDto } from '@modules/vehicle/controllers/update-vehicle.dto';
import { GetVehicleService } from '@modules/vehicle/services/get-vehicle.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class UpdateVehicleService {
    constructor(private logger: Logger, private getVehicleService: GetVehicleService) {}

    @Transactional()
    async updateVehicle(vehicleId: number, dto: UpdateVehicleDto): Promise<Vehicle> {
        this.logger.log({ message: 'Updating Vehicle: ', detail: merge({ id: vehicleId }, dto), fn: this.updateVehicle.name });

        let vehicle = await Vehicle.findWithMinimalRelations().andWhere('vehicle.vehicleId = :id', { id: vehicleId }).getOne();

        if (!vehicle) {
            throw new BadRequestException({ message: `Vehicle not found` });
        }

        vehicle = merge(vehicle, dto);

        try {
            vehicle = await vehicle.save();
        } catch (e) {
            this.logger.error({
                message: 'Failed to update vehicle',
                detail: {
                    error: e.message,
                    stack: e.stack,
                },
                fn: this.updateVehicle.name,
            });
            throw new InternalServerErrorException({ message: `Failed to update the vehicle - please contact the developers` });
        }

        this.logger.log({ message: 'Updated Vehicle: ', detail: vehicleId, fn: this.updateVehicle.name });
        await Log.createAndSave({ vehicle, type: LogType.Updated, message: 'Updated vehicle successfully', priority: LogPriority.High });
        return this.getVehicleService.getVehicle(vehicleId);
    }
}
