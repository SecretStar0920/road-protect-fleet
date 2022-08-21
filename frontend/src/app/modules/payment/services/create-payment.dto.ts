import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';

export class CreatePaymentDto {
    // Insert update properties
}

export class UploadManualProofOfPaymentDto {
    @IsDefined()
    @IsString()
    @Transform((val) => `${val}`)
    @SpreadsheetMetadata({ required: true })
    noticeNumber: string;

    @IsDefined()
    @IsString()
    @SpreadsheetMetadata({ required: true })
    issuer: string;

    @IsDefined()
    @IsString()
    @Transform((val) => `${val}`)
    @SpreadsheetMetadata()
    referenceNumber: string;

    @IsOptional()
    @IsString()
    @Transform((val) => `${val}`)
    @SpreadsheetMetadata()
    amountPaid: string;
}
