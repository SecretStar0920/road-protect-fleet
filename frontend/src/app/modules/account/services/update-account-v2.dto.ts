import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AccountType } from '@modules/shared/models/entities/account-type.enum';
import { AccountDetails, AccountRole } from '@modules/shared/models/entities/account.model';
import { Type } from 'class-transformer';
import { UpdatePhysicalLocationDto, UpdatePostalLocationDto } from '@modules/location/services/update-location-detailed.dto';

export class UpdateAccountV2Dto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    identifier?: string;

    @IsString()
    @IsOptional()
    type?: AccountType;

    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;

    @IsBoolean()
    @IsOptional()
    managed?: boolean;

    @IsEmail()
    @IsOptional()
    primaryContact?: string;

    @IsString()
    @IsOptional()
    role?: AccountRole;

    @IsNumber()
    @IsOptional()
    documentId?: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => AccountDetails)
    details?: AccountDetails;

    @ValidateNested()
    @Type(() => UpdatePhysicalLocationDto)
    physicalLocation?: UpdatePhysicalLocationDto;

    @ValidateNested()
    @Type(() => UpdatePostalLocationDto)
    postalLocation?: UpdatePostalLocationDto;
}
