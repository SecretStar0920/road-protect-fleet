import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { AccountRole } from '@modules/shared/models/entities/account.model';
import { Transform } from 'class-transformer';
import { isNil } from 'lodash';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/services/create-location-detailed.dto';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class CreateAccountSpreadsheetDto extends CreateLocationSingleDto {
    @IsString()
    @SpreadsheetMetadata({ required: true })
    identifier: string;

    @IsString()
    @SpreadsheetMetadata({ required: true })
    name: string;

    @IsString()
    @SpreadsheetMetadata({ required: true })
    role: AccountRole;

    @IsBoolean()
    @IsOptional()
    @Transform((val) => (isNil(val) ? val : false))
    isVerified: boolean;

    @IsEmail()
    @SpreadsheetMetadata({ required: true, label: 'primary contact email' })
    primaryContact: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata()
    contactName: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata()
    contactTelephone: string;

    @IsOptional()
    @IsString()
    @SpreadsheetMetadata()
    contactFax: string;
}

export class CreateAccountV1Dto extends CreateLocationDetailedDto {
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
    @IsString()
    contactName: string;

    @IsOptional()
    @IsString()
    contactTelephone: string;

    @IsOptional()
    @IsString()
    contactFax: string;
}
