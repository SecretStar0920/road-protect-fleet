import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { asString, trimString } from '@modules/shared/helpers/dto-transforms';
import { StandardString } from '@modules/shared/helpers/standard-string.transform';

export class BaseUpdateLocationDto {
    @IsString()
    @IsOptional()
    @StandardString()
    city?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    country?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    code?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    proximity?: string;
}

export class UpdateLocationDetailedDto extends BaseUpdateLocationDto {
    @IsString()
    @IsOptional()
    @StandardString()
    streetName?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    streetNumber?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    postOfficeBox?: string;
}

export class UpdateLocationSingleDto extends BaseUpdateLocationDto {
    @IsString()
    @IsOptional()
    @StandardString()
    rawAddress?: string;
}

//////////////////////////////////////////////////////////////////
// Newer [V2] Create Physical and Create Postal explicit addresses
//////////////////////////////////////////////////////////////////

export class UpdatePhysicalLocationDto {
    @IsOptional()
    @IsString()
    @StandardString()
    city?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    country?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    code?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    proximity?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    streetName?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    streetNumber?: string;
}

export class UpdatePostalLocationDto {
    @IsOptional()
    @IsString()
    @StandardString()
    city?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    country?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    code?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    proximity?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    postOfficeBox?: string;
}
