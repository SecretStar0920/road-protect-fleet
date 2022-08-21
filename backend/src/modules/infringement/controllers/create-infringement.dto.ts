import { ArrayUnique, IsBoolean, IsDefined, IsEnum, IsIn, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InfringementNote, InfringementTag, InfringementType, RedirectionType } from '@entities';
import { asCurrency, asInteger, asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';
import { CreateLocationDetailedDto, CreateLocationSingleDto } from '@modules/location/controllers/create-location-detailed.dto';
import { Default } from '@modules/shared/helpers/default.transform';
import { NoticeNumber } from '@modules/shared/helpers/notice-number.transform';
import { StandardString } from '@modules/shared/helpers/standard-string.transform';
import { RegistrationNumber } from '@modules/shared/helpers/registration.transform';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { NotFutureOffenceDate } from '@modules/shared/validators/not-future-offence-date.validator';

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
    documentId?: number;
    redirectionIdentifier?: string;
    redirectionReference?: string;
    redirectionLetterSendDate?: string;
    dateRedirectionCompleted?: string;
    paymentDate?: string;
    paymentAmount?: number;
    paymentReference?: string;
    redirectionType?: RedirectionType;
    note?: string;
}

export class CreateInfringementSpreadsheetDto extends CreateLocationSingleDto implements ICreateInfringementDto {
    @IsString()
    @NoticeNumber()
    @ApiProperty({ description: 'The notice number of the infringement' })
    @Expose()
    noticeNumber: string;

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

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiProperty({ description: 'The type of the offence', required: false })
    @Expose()
    type?: InfringementType;

    @IsDefined()
    @ApiProperty({ description: 'The name/code of the issuer as existing on the system' })
    @StandardString()
    @Expose()
    issuer: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The infringement status that the issuer has', required: false })
    @Expose()
    @StandardString()
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiProperty({ description: 'The infringement status description that the issuer has', required: false })
    @Expose()
    issuerStatusDescription?: string;

    @IsDefined()
    @Transform((val) => {
        return vehicleRegistrationFormat(val);
    })
    @Expose()
    vehicle: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @ApiProperty({ description: 'The amount to pay for the infringement' })
    @Expose()
    amountDue: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @ApiProperty({ description: 'The original amount to pay for the infringement' })
    @Expose()
    originalAmount: string;

    @IsString()
    @FixDate()
    @ApiProperty({ description: 'The date of offence' })
    @Expose()
    @IsDefined()
    @NotFutureOffenceDate()
    offenceDate: string;

    @IsString()
    @FixDate()
    @IsOptional()
    @ApiProperty({
        description: 'The latest date that the infringement may be paid, default to 90 days after offence date',
        required: false,
    })
    @Expose()
    latestPaymentDate?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiProperty({ description: 'The case number of the offence', required: false })
    @Expose()
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The brn of the account the infringement is nominated to', required: false })
    @RegistrationNumber()
    @Expose()
    brn?: string;

    @IsOptional()
    @ApiProperty({ description: 'A scan of the infringement', required: false })
    @Expose()
    documentId?: number; // document id

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

    @FixDate()
    @Expose()
    @IsOptional()
    paymentDate?: string;

    @Expose()
    @IsOptional()
    note?: string;

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
    setRedirectionIdentifier?: boolean;

    @IsOptional()
    @IsString()
    @Expose()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;

    @IsOptional()
    @IsBoolean()
    @Expose()
    @Default(false)
    // This is a field that we set to true when the creation of update of the infringement is
    // coming from an external source
    isExternal?: boolean;
}

export class CreateInfringementDto extends CreateLocationDetailedDto implements ICreateInfringementDto {
    @IsString()
    @NoticeNumber()
    @ApiProperty({ description: 'The notice number of the infringement' })
    @Expose()
    noticeNumber: string;

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

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiProperty({ description: 'The type of the offence', required: false })
    @Expose()
    type?: InfringementType;

    @IsDefined()
    @ApiProperty({ description: 'The name/code of the issuer as existing on the system' })
    @StandardString()
    @Expose()
    issuer: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The infringement status that the issuer has', required: false })
    @Expose()
    @StandardString()
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiProperty({ description: 'The infringement status description that the issuer has', required: false })
    @Expose()
    issuerStatusDescription?: string;

    @IsDefined()
    @Transform((val) => {
        return vehicleRegistrationFormat(val);
    })
    @Expose()
    vehicle: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @ApiProperty({ description: 'The amount to pay for the infringement' })
    @Expose()
    amountDue: string;

    @IsNumberString()
    @Transform((val) => asCurrency(val))
    @ApiProperty({ description: 'The original amount to pay for the infringement' })
    @Expose()
    originalAmount: string;

    @IsString()
    @FixDate()
    @ApiProperty({ description: 'The date of offence' })
    @Expose()
    @IsDefined()
    @NotFutureOffenceDate()
    offenceDate: string;

    @IsString()
    @FixDate()
    @IsOptional()
    @ApiProperty({
        description: 'The latest date that the infringement may be paid, default to 90 days after offence date',
        required: false,
    })
    @Expose()
    latestPaymentDate?: string;

    @IsString()
    @IsOptional()
    @StandardString()
    @ApiProperty({ description: 'The case number of the offence', required: false })
    @Expose()
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The brn of the account the infringement is nominated to', required: false })
    @StandardString()
    @Expose()
    brn?: string;

    @IsOptional()
    @ApiProperty({ description: 'A scan of the infringement', required: false })
    @Expose()
    documentId?: number; // document id

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

    @IsOptional()
    @IsBoolean()
    @Expose()
    @Default(false)
    // This is a field that we set to true when the creation of update of the infringement is
    // coming from an external source
    isExternal?: boolean;

    @IsString()
    @IsOptional()
    @FixDate()
    @Expose()
    approvedDate?: string;

    @Expose()
    @IsOptional()
    note?: string;

    @IsOptional()
    @Expose()
    @IsEnum(InfringementTag, { each: true })
    @ArrayUnique()
    tags?: InfringementTag[];
}
