import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { InfringementTag, InfringementType } from '@modules/shared/models/entities/infringement.model';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/services/update-location-detailed.dto';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';
import { RequestInformationDetails } from '@modules/shared/models/entities/account.model';

export interface IUpdateInfringement {
    noticeNumber?: string;
    issuer?: string;
    amountDue?: string;
    offenceDate?: string;
    latestPaymentDate?: string;
    issuerStatus?: string;
    issuerStatusDescription?: string;
    caseNumber?: string;
    brn?: string;
    type?: InfringementType;
}

export class UpdateInfringementSpreadsheetDto extends UpdateLocationSingleDto implements IUpdateInfringement {
    // For finding, can't actually be updated
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ required: true, label: 'infringement.notice_number' })
    noticeNumber?: string;

    @IsOptional()
    @SpreadsheetMetadata({ required: true, label: 'infringement.issuer' })
    issuer?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status' })
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status_description' })
    issuerStatusDescription?: string;

    @IsNumberString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.amount_due' })
    amountDue?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.latest_payment_date' })
    latestPaymentDate?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.case_number' })
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.brn' })
    brn?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.type' })
    type?: InfringementType;
}

export class UpdateInfringementDto extends UpdateLocationDetailedDto implements IUpdateInfringement {
    // For finding, can't actually be updated
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ required: true, label: 'infringement.notice_number' })
    noticeNumber?: string;

    @IsOptional()
    @SpreadsheetMetadata({ required: true, label: 'infringement.issuer' })
    issuer?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status' })
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status_description' })
    issuerStatusDescription?: string;

    @IsNumberString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.amount_due' })
    amountDue?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.latest_payment_date' })
    latestPaymentDate?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.case_number' })
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.brn' })
    brn?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.type' })
    type?: InfringementType;

    @IsOptional()
    requestInformationDetails?: RequestInformationDetails;

    @IsOptional()
    documentId?: number;

    @IsIn(Object.values(InfringementTag))
    @IsOptional()
    tags?: InfringementTag[];
}
