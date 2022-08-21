import { IsDefined, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { InfringementTag, InfringementType } from '@modules/shared/models/entities/infringement.model';
import { asString } from '@modules/shared/constants/dto-transforms';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/services/create-location-detailed.dto';

export interface ICreateInfringementDto {
    noticeNumber: string;

    issuer: string;

    issuerStatus?: string;

    issuerStatusDescription?: string;

    reason?: string;

    reasonCode?: string;

    type?: InfringementType;

    vehicle: string;

    amountDue: string;

    originalAmount: string;

    offenceDate: string;

    latestPaymentDate?: string;

    caseNumber?: string;

    brn?: string;

    // relations

    documentId?: number; // document id
}

export class CreateInfringementSpreadsheetDto extends CreateLocationSingleDto implements ICreateInfringementDto {
    @IsString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.notice_number' })
    noticeNumber: string;

    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'infringement.issuer' })
    issuer: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status' })
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status_description' })
    issuerStatusDescription?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason' })
    reason?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason_code' })
    reasonCode?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.type' })
    type?: InfringementType;

    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'infringement.vehicle' })
    vehicle: string;

    @IsNumberString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.amount_due' })
    amountDue: string;

    @IsNumberString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.original_amount' })
    originalAmount: string;

    @IsString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.offence_date' })
    offenceDate: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.latest_payment_date' })
    latestPaymentDate?: string;

    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'infringement.case_number' })
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.brn' })
    brn?: string;

    // relations

    @IsOptional()
    documentId?: number; // document id
}

export class CreateInfringementDto extends CreateLocationDetailedDto implements ICreateInfringementDto {
    @IsString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.notice_number' })
    noticeNumber: string;

    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'infringement.issuer' })
    issuer: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status' })
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status_description' })
    issuerStatusDescription?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason' })
    reason?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason_code' })
    reasonCode?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.type' })
    type?: InfringementType;

    @IsDefined()
    @SpreadsheetMetadata({ required: true, label: 'infringement.vehicle' })
    vehicle: string;

    @IsNumberString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.amount_due' })
    amountDue: string;

    @IsNumberString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.original_amount' })
    originalAmount: string;

    @IsString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.offence_date' })
    offenceDate: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.latest_payment_date' })
    latestPaymentDate?: string;

    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @SpreadsheetMetadata({ label: 'infringement.case_number' })
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.brn' })
    brn?: string;

    // relations

    @IsOptional()
    documentId?: number; // document id

    @IsIn(Object.values(InfringementTag))
    @IsOptional()
    tags?: InfringementTag[];
}
