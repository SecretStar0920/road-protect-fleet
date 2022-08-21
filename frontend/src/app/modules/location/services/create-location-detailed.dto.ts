import { IsDefined, IsOptional, IsString } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class BaseCreateLocationDto {
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ required: true, order: 1, label: 'address.city' })
    city: string;

    @IsString()
    @SpreadsheetMetadata({ required: true, order: 1, label: 'address.country' })
    country: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ order: 1, label: 'address.zip_code' })
    code?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ order: 1, label: 'address.proximity' })
    proximity?: string;
}

export class CreateLocationDetailedDto extends BaseCreateLocationDto {
    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ order: 1, label: 'address.street_name' })
    streetName?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ order: 1, label: 'address.street_number' })
    streetNumber?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ order: 1, label: 'address.post_office_box' })
    postOfficeBox?: string;
}

export class CreateLocationSingleDto extends BaseCreateLocationDto {
    @IsString()
    @IsDefined()
    @SpreadsheetMetadata({ required: true, order: 1, label: 'address.address' })
    rawAddress: string;
}

//////////////////////////////////////////////////////////////////
// Newer [V2] Create Physical and Create Postal explicit addresses
//////////////////////////////////////////////////////////////////

export class CreatePhysicalLocationDto {
    @IsString()
    @SpreadsheetMetadata({ label: 'address.city' })
    city: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'address.city' })
    country: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.code' })
    code?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.proximity' })
    proximity?: string;

    @IsDefined()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.street_name' })
    streetName?: string;

    @IsDefined()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.street_number' })
    streetNumber?: string;
}

export class CreatePostalLocationDto {
    @IsString()
    @SpreadsheetMetadata({ label: 'address.city' })
    city: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'address.country' })
    country: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.code' })
    code?: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.proximity' })
    proximity?: string;

    @IsDefined()
    @IsString()
    @SpreadsheetMetadata({ label: 'address.post_office_box' })
    postOfficeBox: string;
}
