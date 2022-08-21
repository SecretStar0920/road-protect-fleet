import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { LocationType, PhysicalLocation, PostalLocation } from '@entities';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
    CreateLocationDetailedDto,
    CreatePhysicalLocationDto,
    CreatePostalLocationDto,
} from '@modules/location/controllers/create-location-detailed.dto';
import { plainToClass } from 'class-transformer';
import { mapValues } from 'lodash';
import { validate, ValidationError } from 'class-validator';

export interface IValidateAndInferLocationsResponse {
    Physical: { valid: boolean; validationErrors: ValidationError[] };
    Postal: { valid: boolean; validationErrors: ValidationError[] };
    Both: { valid: boolean; validationErrors: ValidationError[] };
}

@Injectable()
export class CreateLocationService {
    constructor(private logger: Logger) {}

    //////////////////////////////////////////////////////////////////
    // PHYSICAL
    //////////////////////////////////////////////////////////////////

    @Transactional()
    async savePhysicalLocation(dto: CreateLocationDetailedDto): Promise<PhysicalLocation> {
        this.logger.debug({ message: 'Creating Physical Location', detail: dto, fn: this.savePhysicalLocation.name });
        const created = this.createPhysicalLocation(dto);
        const location = await created.save();
        this.logger.debug({ message: 'Saved Physical Location', detail: location, fn: this.savePhysicalLocation.name });
        return location;
    }

    createPhysicalLocation(dto: CreateLocationDetailedDto) {
        return PhysicalLocation.create(dto);
    }

    @Transactional()
    async savePhysicalLocationV2(dto: CreatePhysicalLocationDto): Promise<PhysicalLocation> {
        this.logger.debug({ message: 'Creating Physical Location', detail: dto, fn: this.savePhysicalLocationV2.name });
        const created = await this.createPhysicalLocationV2(dto);
        const location = await created.save();
        this.logger.debug({ message: 'Saved Physical Location', detail: location, fn: this.savePhysicalLocationV2.name });
        return location;
    }

    async createPhysicalLocationV2(dto: CreatePhysicalLocationDto): Promise<PhysicalLocation> {
        return PhysicalLocation.create(dto);
    }

    //////////////////////////////////////////////////////////////////
    // POSTAL
    //////////////////////////////////////////////////////////////////

    @Transactional()
    async savePostalLocation(dto: CreateLocationDetailedDto): Promise<PostalLocation> {
        this.logger.debug({ message: 'Creating Postal Location', detail: dto, fn: this.savePostalLocation.name });
        const created = await this.createPostalLocation(dto);
        const location = await created.save();
        this.logger.debug({ message: 'Saved Postal Location', detail: location, fn: this.savePostalLocation.name });
        return location;
    }

    async createPostalLocation(dto: CreateLocationDetailedDto): Promise<PostalLocation> {
        return PostalLocation.create(dto);
    }

    @Transactional()
    async savePostalLocationV2(dto: CreatePostalLocationDto): Promise<PostalLocation> {
        this.logger.debug({ message: 'Creating Postal Location', detail: dto, fn: this.savePostalLocationV2.name });
        const created = await this.createPostalLocationV2(dto);
        const location = await created.save();
        this.logger.debug({ message: 'Saved Postal Location', detail: location, fn: this.savePostalLocationV2.name });
        return location;
    }

    async createPostalLocationV2(dto: CreatePostalLocationDto): Promise<PostalLocation> {
        return PostalLocation.create(dto);
    }

    //////////////////////////////////////////////////////////////////
    // Mapping Old Single Location Dto
    //////////////////////////////////////////////////////////////////

    async validateAndInferLocations(
        dto: any,
    ): Promise<{ dto: CreateLocationDetailedDto; validations: IValidateAndInferLocationsResponse }> {
        // Create dto
        const createLocationDto = this.extractLocationDto(dto);

        // Validate against groups
        const groupValidation = mapValues(
            {
                Physical: await validate(createLocationDto, { groups: [LocationType.Physical] }),
                Postal: await validate(createLocationDto, { groups: [LocationType.Postal] }),
                Both: await validate(createLocationDto, { groups: [LocationType.Postal, LocationType.Physical] }),
            },
            (val) => {
                return {
                    valid: val.length === 0,
                    validationErrors: val,
                };
            },
        );

        return { dto: createLocationDto, validations: groupValidation };
    }

    private extractLocationDto(dto: any) {
        return plainToClass(CreateLocationDetailedDto, dto);
    }
}
