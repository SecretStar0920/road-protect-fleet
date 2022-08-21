import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';
import { InfringementType } from '@modules/shared/models/entities/infringement.model';
import { Transform } from 'class-transformer';
import { asCurrency, asString } from '@modules/shared/constants/dto-transforms';

export class CreatePartialInfringementSpreadsheetDto {
    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.notice_number' })
    noticeNumber?: string | number;

    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.brn' })
    brn?: string | number;

    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.vehicle_registration' })
    vehicle?: string | number;

    @IsString()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.provider' })
    @IsOptional()
    provider?: string;

    @SpreadsheetMetadata({ label: 'upload-partial-infringement.issuer_code' })
    @IsOptional()
    issuerCode?: string; // The code of the issuer as existing on the system

    @SpreadsheetMetadata({ label: 'upload-partial-infringement.issuer_name' })
    @IsOptional()
    issuerName?: string; // The name of the issuer as existing on the system

    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.case_number' })
    caseNumber?: string | number;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.issuer_status' })
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.issuer_status_description' })
    issuerStatusDescription?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.reason' })
    reason?: string;

    @IsOptional()
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.reason_code' })
    reasonCode?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.type' })
    type?: InfringementType;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asCurrency(asString(val)))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.amount_due' })
    amountDue?: string | number;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asCurrency(asString(val)))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.original_amount' })
    originalAmount?: string | number;

    @IsString()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.offence_date' })
    offenceDate?: string;

    @IsString()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'upload-partial-infringement.latest_payment_date' })
    latestPaymentDate?: string;
}
