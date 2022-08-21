import { Injectable } from '@nestjs/common';
import { mapValues, merge } from 'lodash';
import { Logger } from '@logger';
import { Location, LocationType } from '@entities';
import { UpdateLocationDetailedDto } from '@modules/location/controllers/update-location-detailed-dto';
import { validate } from 'class-validator';
import { IValidateAndInferLocationsResponse } from '@modules/location/services/create-location.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UpdateLocationService {
    constructor(private logger: Logger) {}

    async updateLocation(id: number, dto: UpdateLocationDetailedDto): Promise<Location> {
        this.logger.log({ message: 'Updating Location: ', detail: merge({ id }, dto), fn: this.updateLocation.name });
        let location = await Location.findOne(id);
        location = merge(location, dto);
        await location.save();
        this.logger.log({ message: 'Updated Location: ', detail: id, fn: this.updateLocation.name });
        return location;
    }

    async validateAndInferLocations(
        dto: any,
    ): Promise<{ dto: UpdateLocationDetailedDto; validations: IValidateAndInferLocationsResponse }> {
        // Create dto
        const updateLocationDetailedDto = this.extractLocationDto(dto);

        // Validate against groups
        const groupValidation = mapValues(
            {
                Physical: await validate(updateLocationDetailedDto, { groups: [LocationType.Physical] }),
                Postal: await validate(updateLocationDetailedDto, { groups: [LocationType.Postal] }),
                Both: await validate(updateLocationDetailedDto, { groups: [LocationType.Postal, LocationType.Physical] }),
            },
            (val) => {
                return {
                    valid: val.length === 0,
                    validationErrors: val,
                };
            },
        );

        return { dto: updateLocationDetailedDto, validations: groupValidation };
    }

    private extractLocationDto(dto: any): UpdateLocationDetailedDto {
        return plainToClass(UpdateLocationDetailedDto, dto);
    }
}
