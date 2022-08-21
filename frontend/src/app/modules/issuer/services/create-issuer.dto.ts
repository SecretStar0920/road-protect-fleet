import { IsDefined, IsOptional, IsString } from 'class-validator';
import { IssuerType } from '@modules/shared/models/entities/issuer.model';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class CreateIssuerDto {
    @IsString()
    @IsDefined()
    @SpreadsheetMetadata({ required: true })
    name: string;
    @IsString()
    @IsDefined()
    @SpreadsheetMetadata({ required: true })
    code: string;
    @IsString()
    @IsDefined()
    @SpreadsheetMetadata()
    type: IssuerType;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    address: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    email: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    fax: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    telephone: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    contactPerson: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    redirectionEmail: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    externalPaymentLink: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    provider: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    authority: string;
}
