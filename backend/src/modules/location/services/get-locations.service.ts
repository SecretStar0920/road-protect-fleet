import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Location } from '@entities';

@Injectable()
export class GetLocationsService {
    constructor(private logger: Logger) {}

    async getLocations(): Promise<Location[]> {
        this.logger.log({ message: `Getting Locations`, detail: null, fn: this.getLocations.name });
        const locations = await Location.createQueryBuilder('location').getMany();
        this.logger.log({ message: `Found Locations, length: `, detail: locations.length, fn: this.getLocations.name });
        return locations;
    }
}
