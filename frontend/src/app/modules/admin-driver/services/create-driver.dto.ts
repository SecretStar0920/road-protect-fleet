import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
    CreateLocationDetailedDto,
    CreatePhysicalLocationDto,
    CreatePostalLocationDto,
} from '@modules/location/services/create-location-detailed.dto';
import { asString } from '@modules/shared/constants/dto-transforms';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class CreateDriverDto extends CreateLocationDetailedDto {
    @IsDefined()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'driver.name' })
    name: string;

    @IsDefined()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'driver.surname' })
    surname: string;

    @IsDefined()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'driver.id_number' })
    idNumber: string;

    @IsDefined()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'driver.license' })
    licenseNumber: string;

    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'driver.email' })
    email?: string;

    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'driver.cellphone' })
    cellphoneNumber?: string;

    @ValidateNested()
    @Type(() => CreatePhysicalLocationDto)
    physicalLocation: CreatePhysicalLocationDto;

    @ValidateNested()
    @Type(() => CreatePostalLocationDto)
    postalLocation: CreatePostalLocationDto;
}
