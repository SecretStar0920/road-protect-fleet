import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Vehicle } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteVehicleService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteVehicle(id: number): Promise<Vehicle> {
        this.logger.log({ message: 'Deleting Vehicle:', detail: id, fn: this.deleteVehicle.name });
        const vehicle = await Vehicle.findOne(id);
        this.logger.log({ message: 'Found Vehicle:', detail: id, fn: this.deleteVehicle.name });
        if (!vehicle) {
            this.logger.warn({ message: 'Could not find Vehicle to delete', detail: id, fn: this.deleteVehicle.name });
            throw new BadRequestException({ message: ERROR_CODES.E157_CouldNotFindVehicleToDelete.message() });
        }

        await Vehicle.remove(vehicle);
        this.logger.log({ message: 'Deleted Vehicle:', detail: id, fn: this.deleteVehicle.name });
        return Vehicle.create({ vehicleId: id });
    }

    async softDeleteVehicle(id: number): Promise<Vehicle> {
        this.logger.log({ message: 'Soft Deleting Vehicle:', detail: id, fn: this.deleteVehicle.name });
        const vehicle = await Vehicle.findOne(id);
        this.logger.log({ message: 'Found Vehicle:', detail: id, fn: this.deleteVehicle.name });
        if (!vehicle) {
            this.logger.warn({ message: 'Could not find Vehicle to delete', detail: id, fn: this.deleteVehicle.name });
            throw new BadRequestException({ message: ERROR_CODES.E157_CouldNotFindVehicleToDelete.message() });
        }

        // vehicle.active = false;
        await vehicle.save();
        this.logger.log({ message: 'Soft Deleted Vehicle:', detail: id, fn: this.deleteVehicle.name });
        return vehicle;
    }
}
