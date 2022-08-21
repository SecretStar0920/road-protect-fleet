import { IsBoolean, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AccountDetails, AccountRole } from '@modules/shared/models/entities/account.model';
import { Transform, Type } from 'class-transformer';
import { isNil } from 'lodash';
import {
    CreateLocationDetailedDto,
    CreatePhysicalLocationDto,
    CreatePostalLocationDto,
} from '@modules/location/services/create-location-detailed.dto';

export class CreateAccountV2Dto extends CreateLocationDetailedDto {
    @IsString()
    identifier: string;

    @IsString()
    name: string;

    @IsString()
    role: AccountRole;

    @IsBoolean()
    @IsOptional()
    @Transform((val) => (isNil(val) ? val : false))
    isVerified: boolean;

    @IsEmail()
    primaryContact: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => AccountDetails)
    details: AccountDetails;

    @ValidateNested()
    @Type(() => CreatePhysicalLocationDto)
    physicalLocation: CreatePhysicalLocationDto;

    @ValidateNested()
    @Type(() => CreatePostalLocationDto)
    postalLocation: CreatePostalLocationDto;
}
