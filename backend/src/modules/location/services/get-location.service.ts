import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Location } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetLocationService {
    constructor(private logger: Logger) {}

    async getLocation(locationId: number): Promise<Location> {
        this.logger.log({ message: `Getting Location with id: `, detail: locationId, fn: this.getLocation.name });
        const location = await Location.createQueryBuilder('location').andWhere('location.locationId = :id', { id: locationId }).getOne();
        if (!location) {
            throw new BadRequestException({ message: ERROR_CODES.E137_CouldNotFindLocation.message({ locationId }) });
        }
        this.logger.log({ message: `Found Location with id: `, detail: location.locationId, fn: this.getLocation.name });
        return location;
    }
}
