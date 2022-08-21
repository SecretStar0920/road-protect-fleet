import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePhysicalLocationDto, CreatePostalLocationDto } from '@modules/location/services/create-location-detailed.dto';

export class UpdateDriverDto {
    @IsDefined()
    details: any;

    @IsDefined()
    name: string;

    @IsDefined()
    surname: string;

    @IsDefined()
    idNumber: string;

    @IsDefined()
    licenseNumber: string;

    @IsDefined()
    email: string;

    @IsOptional()
    cellphoneNumber?: string;

    @ValidateNested()
    @Type(() => CreatePhysicalLocationDto)
    physicalLocation: CreatePhysicalLocationDto;

    @ValidateNested()
    @Type(() => CreatePostalLocationDto)
    postalLocation: CreatePostalLocationDto;
}
