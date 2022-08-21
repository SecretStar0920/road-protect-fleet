import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Location } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteLocationService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteLocation(id: number): Promise<Location> {
        this.logger.log({ message: 'Deleting Location:', detail: id, fn: this.deleteLocation.name });
        const location = await Location.findOne(id);
        this.logger.log({ message: 'Found Location:', detail: id, fn: this.deleteLocation.name });
        if (!location) {
            this.logger.warn({ message: 'Could not find Location to delete', detail: id, fn: this.deleteLocation.name });
            throw new BadRequestException({ message: ERROR_CODES.E136_CouldNotFindLocationToDelete.message() });
        }

        await Location.remove(location);
        this.logger.log({ message: 'Deleted Location:', detail: id, fn: this.deleteLocation.name });
        return Location.create({ locationId: id });
    }

    async softDeleteLocation(id: number): Promise<Location> {
        this.logger.log({ message: 'Soft Deleting Location:', detail: id, fn: this.deleteLocation.name });
        const location = await Location.findOne(id);
        this.logger.log({ message: 'Found Location:', detail: id, fn: this.deleteLocation.name });
        if (!location) {
            this.logger.warn({ message: 'Could not find Location to delete', detail: id, fn: this.deleteLocation.name });
            throw new BadRequestException({ message: ERROR_CODES.E136_CouldNotFindLocationToDelete.message() });
        }

        // location.active = false;
        await location.save();
        this.logger.log({ message: 'Soft Deleted Location:', detail: id, fn: this.deleteLocation.name });
        return location;
    }
}
