import {
    ArrayUnique, IsArray,
    IsBoolean,
    IsEnum,
    IsIn,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { asCurrency } from '@modules/shared/helpers/dto-transforms';
import { InfringementStatus, InfringementTag, InfringementType } from '@modules/shared/entities/infringement.entity';
import { UpdateLocationDetailedDto, UpdateLocationSingleDto } from '@modules/location/controllers/update-location-detailed-dto';
import { Default } from '@modules/shared/helpers/default.transform';
import { RedirectionType } from '@entities';
import { NoticeNumber } from '@modules/shared/helpers/notice-number.transform';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { RegistrationNumber } from '@modules/shared/helpers/registration.transform';
import { StandardString } from '@modules/shared/helpers/standard-string.transform';
import { NotFutureOffenceDate } from '@modules/shared/validators/not-future-offence-date.validator';
import { NominationStatus } from '@modules/shared/models/nomination-status';

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
    redirectionIdentifier?: string;
    redirectionReference?: string;
    redirectionLetterSendDate?: string;
    dateRedirectionCompleted?: string;
    paymentDate?: string;
    paymentAmount?: number;
    paymentReference?: string;
    redirectionType?: RedirectionType;
    notes?: string[];
    note?: string;
    tags?: InfringementTag[];
}

export class UpdateInfringementSpreadsheetDto extends UpdateLocationSingleDto implements IUpdateInfringement {
    // For finding, can't actually be updated
    @IsString()
    @IsOptional()
    @NoticeNumber()
    @ApiPropertyOptional()
    @Expose()
    noticeNumber?: string;

    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @StandardString()
    issuer?: string;

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
    @IsOptional()
    @ApiPropertyOptional()
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
    @StandardString()
    @ApiPropertyOptional()
    @Expose()
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @RegistrationNumber()
    brn?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    type?: InfringementType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'An identifier of the person or business that you are redirecting the infringement to',
        required: false,
    })
    @Expose()
    @RegistrationNumber()
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
    @ApiPropertyOptional({ description: 'The date that the redirection letter was sent to the municipality', required: false })
    @Expose()
    redirectionLetterSendDate?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional({ description: 'The date that the redirection completed' })
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
    @Expose()
    notes?: string[];

    @IsOptional()
    @IsString()
    @Expose()
    note?: string;

    @IsOptional()
    @IsBoolean()
    @Expose()
    @Default(false)
    // This is a field that we set to true when the creation of update of the infringement is
    // coming from an external source
    isExternal?: boolean;

    @IsOptional()
    @IsString()
    @Expose()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;
}

export class UpdateInfringementDto extends UpdateLocationDetailedDto implements IUpdateInfringement {
    // For finding, can't actually be updated
    @IsString()
    @IsOptional()
    @NoticeNumber()
    @ApiPropertyOptional()
    @Expose()
    noticeNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The reason for the offence', required: false })
    @Expose()
    @StandardString()
    reason?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The reason code for the offence', required: false })
    @StandardString()
    @Expose()
    reasonCode?: string;

    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @StandardString()
    issuer?: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    amountDue?: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    originalAmount?: string;

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
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    @StandardString()
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
    @RegistrationNumber()
    @ApiPropertyOptional()
    @Expose()
    brn?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    type?: InfringementType;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'An identifier of the person or business that you are redirecting the infringement to',
        required: false,
    })
    @Expose()
    @RegistrationNumber()
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
    @ApiPropertyOptional({ description: 'The date that the redirection letter was sent to the municipality', required: false })
    @Expose()
    redirectionLetterSendDate?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @ApiPropertyOptional({ description: 'The date that the redirection completed' })
    @Expose()
    dateRedirectionCompleted?: string;

    @IsOptional()
    @IsIn(Object.values(RedirectionType))
    @Expose()
    redirectionType?: RedirectionType;

    @IsIn(Object.values(InfringementStatus))
    @IsOptional()
    @ApiPropertyOptional()
    @Expose()
    infringementStatus?: InfringementStatus;

    @IsIn(Object.values(NominationStatus))
    @IsOptional()
    @ApiPropertyOptional()
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

    @IsOptional()
    @IsBoolean()
    @Expose()
    @Default(false)
    // This is a field that we set to true when the creation of update of the infringement is
    // coming from an external source
    isExternal?: boolean;

    @IsBoolean()
    @IsOptional()
    @Expose()
    setRedirectionIdentifier?: boolean;

    @IsBoolean()
    @IsOptional()
    @Expose()
    setRedirectionCompletionDate?: boolean;

    @IsOptional()
    @IsString()
    @Expose()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;

    @IsString()
    @IsOptional()
    @FixDate()
    @Expose()
    approvedDate?: string;

    @IsOptional()
    @Expose()
    notes?: string[];

    @IsOptional()
    @IsString()
    @Expose()
    note?: string;

    @IsOptional()
    @IsArray()
    @Expose()
    documentIds?: number[];

    @IsOptional()
    @Expose()
    @IsEnum(InfringementTag, { each: true })
    @ArrayUnique()
    tags?: InfringementTag[];
}
