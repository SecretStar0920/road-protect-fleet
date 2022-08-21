import { IsDefined, IsIn, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { InfringementStatus, InfringementType } from '@modules/shared/models/entities/infringement.model';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/services/update-location-detailed.dto';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';
import { NominationStatus } from '@modules/shared/models/entities/nomination.model';

export interface IUpsertInfringement {
    noticeNumber: string;
    issuer?: string;
    amountDue?: string;
    offenceDate?: string;
    latestPaymentDate?: string;
    issuerStatus?: string;
    issuerStatusDescription?: string;
    caseNumber?: string;
    brn?: string;
    type?: InfringementType;
    reason?: string;
    reasonCode?: string;
    vehicle?: string;
    originalAmount?: string;
    redirectionIdentifier?: string;
    redirectionLetterSendDate?: string;
    redirectionCompletionDate?: string;
    redirectionReference?: string;
    paymentDate?: string;
    paymentAmount?: number;
    paymentReference?: string;
    note?: string;
}

export class UpsertInfringementSpreadsheetDto extends UpdateLocationSingleDto implements IUpsertInfringement {
    // For finding, can't actually be updated
    @IsString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.notice_number' })
    noticeNumber: string;

    @SpreadsheetMetadata({ label: 'infringement.issuer' })
    @IsOptional()
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

    @IsDefined()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.vehicle' })
    vehicle?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason' })
    reason?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason_code' })
    reasonCode?: string;

    @IsNumberString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.original_amount' })
    originalAmount?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.offence_date' })
    offenceDate?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_identifier' })
    @IsOptional()
    redirectionIdentifier?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_letter_send_date' })
    @IsOptional()
    redirectionLetterSendDate?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_reference' })
    @IsOptional()
    redirectionReference?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_completion_date' })
    @IsOptional()
    dateRedirectionCompleted?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.payment_date', required: false })
    paymentDate?: string;

    @IsNumber()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.payment_amount', required: false })
    paymentAmount?: number;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.payment_reference', required: false })
    paymentReference?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.note', required: false })
    note?: string;
}

export class UpsertInfringementDto extends UpdateLocationDetailedDto implements IUpsertInfringement {
    // For finding, can't actually be updated
    @IsString()
    @SpreadsheetMetadata({ required: true, label: 'infringement.notice_number' })
    noticeNumber: string;

    @SpreadsheetMetadata({ label: 'infringement.issuer' })
    @IsOptional()
    issuer?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.issuer_status' })
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.vehicle' })
    vehicle?: string;

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

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason' })
    reason?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.reason_code' })
    reasonCode?: string;

    @IsNumberString()
    @SpreadsheetMetadata({ label: 'infringement.original_amount' })
    @IsOptional()
    originalAmount?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'infringement.offence_date' })
    @IsOptional()
    offenceDate?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_identifier' })
    @IsOptional()
    redirectionIdentifier?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_letter_send_date' })
    @IsOptional()
    redirectionLetterSendDate?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_reference' })
    @IsOptional()
    redirectionReference?: string;

    @IsString()
    @SpreadsheetMetadata({ label: 'nomination.redirection_completion_date' })
    @IsOptional()
    dateRedirectionCompleted?: string;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.payment_date', required: false })
    paymentDate?: string;

    @IsNumber()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.payment_amount', required: false })
    paymentAmount?: number;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.payment_reference', required: false })
    paymentReference?: string;

    @IsIn(Object.values(InfringementStatus))
    @IsOptional()
    infringementStatus?: InfringementStatus;

    @IsIn(Object.values(NominationStatus))
    @IsOptional()
    nominationStatus?: NominationStatus;

    @IsString()
    @IsOptional()
    @SpreadsheetMetadata({ label: 'infringement.note', required: false })
    note?: string;
}
