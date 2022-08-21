import { IsOptional, IsString } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class BaseUpdateLocationDto {
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'address.city' })
    city?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'address.country' })
    country?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.code' })
    code?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.proximity' })
    proximity?: string;
}

export class UpdateLocationDetailedDto extends BaseUpdateLocationDto {
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'address.street_name' })
    streetName?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'address.street_number' })
    streetNumber?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.post_office_box' })
    postOfficeBox?: string;
}

export class UpdateLocationSingleDto extends BaseUpdateLocationDto {
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'address.address' })
    rawAddress?: string;
}

//////////////////////////////////////////////////////////////////
// Newer [V2] Create Physical and Create Postal explicit addresses
//////////////////////////////////////////////////////////////////

export class UpdatePhysicalLocationDto {
    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.cit' })
    city?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.country' })
    country?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.code' })
    code?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.proximity' })
    proximity?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.street_name' })
    streetName?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.street_number' })
    streetNumber?: string;
}

export class UpdatePostalLocationDto {
    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.city' })
    city?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.country' })
    country?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.code' })
    code?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.proximity' })
    proximity?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.post_office_box' })
    postOfficeBox?: string;
}
