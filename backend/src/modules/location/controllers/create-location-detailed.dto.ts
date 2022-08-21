import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { asString, trimString } from '@modules/shared/helpers/dto-transforms';
import { LocationType } from '@entities';
import { Default } from '@modules/shared/helpers/default.transform';
import { Config } from '@config/config';
import { StandardString } from '@modules/shared/helpers/standard-string.transform';
import { ApiProperty } from '@nestjs/swagger';

export class BaseCreateLocationDto {
    @IsString()
    @StandardString()
    @ApiProperty()
    city: string;

    @IsString()
    @StandardString()
    @Default(Config.get.app.defaultCountry)
    @ApiProperty()
    country: string;

    @IsOptional()
    @IsString()
    @StandardString()
    @ApiProperty()
    code?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    @ApiProperty()
    proximity?: string;
}

/**
 * Create using explicit details for streetName, streetNumber or postOfficeBox
 * This gets interpreted to create either a physical location or postal location for accounts
 * For infringements this is not handled
 */
export class CreateLocationDetailedDto extends BaseCreateLocationDto {
    @IsOptional()
    @IsDefined({ groups: [LocationType.Physical] })
    @IsString()
    @StandardString()
    @ApiProperty()
    streetName?: string;

    @IsOptional()
    @IsDefined({ groups: [LocationType.Physical] })
    @IsString()
    @StandardString()
    @ApiProperty()
    streetNumber?: string;

    @IsOptional()
    @IsDefined({ groups: [LocationType.Postal] })
    @IsString()
    @StandardString()
    @ApiProperty()
    postOfficeBox?: string;
}

/**
 * Given a single line entry address separated by commas
 * this is used in the RawLocationParserHelper to figure out the fields as identified in the createLocationDetailed DTO
 */
export class CreateLocationSingleDto extends BaseCreateLocationDto {
    @IsString()
    @IsDefined()
    @StandardString()
    @ApiProperty()
    rawAddress: string;
}

//////////////////////////////////////////////////////////////////
// Newer [V2] Create Physical and Create Postal explicit addresses
//////////////////////////////////////////////////////////////////

export class CreatePhysicalLocationDto {
    @IsString()
    @StandardString()
    @ApiProperty()
    city: string;

    @IsString()
    @StandardString()
    @ApiProperty()
    country: string;

    @IsOptional()
    @IsString()
    @StandardString()
    @ApiProperty()
    code?: string;

    @IsOptional()
    @IsString()
    @StandardString()
    @ApiProperty()
    proximity?: string;

    @IsDefined()
    @IsString()
    @StandardString()
    @ApiProperty()
    streetName?: string;

    @IsDefined()
    @IsString()
    @StandardString()
    @ApiProperty()
    streetNumber?: string;
}

export class CreatePostalLocationDto {
    @IsString()
    @IsNotEmpty()
    @StandardString()
    @ApiProperty()
    city: string;

    @IsString()
    @IsNotEmpty()
    @StandardString()
    @ApiProperty()
    country: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @StandardString()
    @ApiProperty()
    code?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @StandardString()
    @ApiProperty()
    proximity?: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @StandardString()
    @ApiProperty()
    postOfficeBox: string;
}
