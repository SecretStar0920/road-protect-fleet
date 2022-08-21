import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { IsBoolean, IsDefined, IsIn, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { asCurrency, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';
import { InfringementStatus, InfringementType, RedirectionType } from '@entities';
import { Default } from '@modules/shared/helpers/default.transform';
import { NoticeNumber } from '@modules/shared/helpers/notice-number.transform';
import { StandardString } from '@modules/shared/helpers/standard-string.transform';
import { RegistrationNumber } from '@modules/shared/helpers/registration.transform';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { NotFutureOffenceDate } from '@modules/shared/validators/not-future-offence-date.validator';
import { NominationStatus } from '@modules/shared/models/nomination-status';

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
    setRedirectionIdentifier?: boolean;
    redirectionReference?: string;
    paymentDate?: string;
    paymentAmount?: number;
    paymentReference?: string;
    redirectionType?: RedirectionType;
    note?: string;
}

export class UpsertInfringementDto extends UpdateLocationDetailedDto implements IUpsertInfringement {
    // For finding, can't actually be updated
    @IsString()
    @NoticeNumber()
    @Expose()
    noticeNumber: string;

    @IsString()
    @StandardString()
    @Expose()
    issuer?: string;

    @IsOptional()
    @Transform((val) => {
        return vehicleRegistrationFormat(val);
    })
    @Expose()
    vehicle?: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    amountDue?: string;

    @IsOptional()
    @IsString()
    @FixDate()
    @ApiPropertyOptional()
    @Expose()
    @NotFutureOffenceDate()
    offenceDate?: string;

    @IsString()
    @FixDate()
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    latestPaymentDate?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    @StandardString()
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @StandardString()
    issuerStatusDescription?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @StandardString()
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @RegistrationNumber()
    @StandardString()
    brn?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    type?: InfringementType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @StandardString()
    @Expose()
    reason?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @StandardString()
    @Expose()
    reasonCode?: string;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asCurrency(val))
    @ApiPropertyOptional()
    @Expose()
    originalAmount?: string;

    @IsString()
    @IsOptional()
    @RegistrationNumber()
    @Expose()
    @StandardString()
    redirectionIdentifier?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'A reference attached to the redirection',
        required: false,
    })
    @Expose()
    @StandardString()
    redirectionReference?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional()
    @Expose()
    redirectionLetterSendDate?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional()
    @Expose()
    dateRedirectionCompleted?: string;

    @IsOptional()
    @IsIn(Object.values(RedirectionType))
    @Expose()
    redirectionType?: RedirectionType;

    @IsIn(Object.values(InfringementStatus))
    @IsOptional()
    @Expose()
    infringementStatus?: InfringementStatus;

    @IsIn(Object.values(NominationStatus))
    @IsOptional()
    @Expose()
    nominationStatus?: NominationStatus;

    @FixDate()
    @Expose()
    @IsOptional()
    paymentDate?: string;

    @IsNumber()
    @Expose()
    @IsOptional()
    paymentAmount?: number;

    @Expose()
    @IsOptional()
    paymentReference?: string;

    @IsBoolean()
    @IsOptional()
    @Expose()
    @Default(false)
    // There are very specific cases where we should actually set the redirection identifier,
    // for the logic to work, we use this boolean to determine when it should be overwritten.
    setRedirectionIdentifier?: boolean;

    @IsBoolean()
    @IsOptional()
    @Expose()
    @Default(false)
    // There are very specific cases where we should actually set the redirection completion date,
    // for the logic to work, we use this boolean to determine when it should be overwritten.
    setRedirectionCompletionDate?: boolean;

    @IsOptional()
    @IsBoolean()
    @Expose()
    @Default(false)
    // This is a field that we set to true when the creation of update of the infringement is
    // coming from an external source
    isExternal: boolean;

    @IsString()
    @Expose()
    @IsOptional()
    note?: string;

    @IsOptional()
    @IsString()
    @Expose()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;

    markAsExternalChange() {
        this.isExternal = true;
        return this;
    }

    markSetRedirectionIdentifier(set = true) {
        this.setRedirectionIdentifier = set;
        return this;
    }

    setRedirectionType(redirectionType: RedirectionType) {
        this.redirectionType = redirectionType;
        return this;
    }
}

export class UpsertInfringementSpreadsheetDto extends UpdateLocationSingleDto implements IUpsertInfringement {
    // For finding, can't actually be updated
    @IsString()
    @NoticeNumber()
    @Expose()
    noticeNumber: string;

    @IsString()
    @StandardString()
    @Expose()
    issuer?: string;

    @IsDefined()
    @Transform((val) => {
        return vehicleRegistrationFormat(val);
    })
    @Expose()
    @IsOptional()
    vehicle?: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    amountDue?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional()
    @Expose()
    @NotFutureOffenceDate()
    offenceDate?: string;

    @IsString()
    @FixDate()
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    latestPaymentDate?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiPropertyOptional()
    @Expose()
    issuerStatusDescription?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiPropertyOptional()
    @Expose()
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiPropertyOptional()
    brn?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    type?: InfringementType;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiPropertyOptional()
    @Expose()
    reason?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @StandardString()
    @Expose()
    reasonCode?: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @ApiPropertyOptional()
    @IsOptional()
    @Expose()
    originalAmount?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional()
    @Expose()
    redirectionLetterSendDate?: string;

    @IsBoolean()
    @IsOptional()
    @Expose()
    @Default(false)
    // There are very specific cases where we should actually set the redirection identifier,
    // for the logic to work, we use this boolean to determine when it should be overwritten.
    setRedirectionIdentifier?: boolean;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'A reference attached to the redirection',
        required: false,
    })
    @Expose()
    @StandardString()
    redirectionReference?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional()
    @Expose()
    dateRedirectionCompleted?: string;

    @IsOptional()
    @IsIn(Object.values(RedirectionType))
    @Expose()
    redirectionType?: RedirectionType;

    @FixDate()
    @Expose()
    @IsOptional()
    paymentDate?: string;

    @IsNumber()
    @Expose()
    @IsOptional()
    paymentAmount?: number;

    @Expose()
    @IsOptional()
    paymentReference?: string;

    @IsOptional()
    @IsBoolean()
    @Expose()
    @Default(false)
    // This is a field that we set to true when the creation of update of the infringement is
    // coming from an external source
    isExternal: boolean;

    @IsString()
    @Expose()
    @IsOptional()
    note?: string;

    @IsOptional()
    @IsString()
    @Expose()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;

    markAsExternalChange() {
        this.isExternal = true;
        return this;
    }

    markSetRedirectionIdentifier(set = true) {
        this.setRedirectionIdentifier = set;
        return this;
    }

    setRedirectionType(redirectionType: RedirectionType) {
        this.redirectionType = redirectionType;
        return this;
    }
}
