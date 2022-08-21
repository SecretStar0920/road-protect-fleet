import { IsDateString, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { InfringementType } from '@entities';
import { asCurrency, asString } from '@modules/shared/helpers/dto-transforms';
import { Transform } from 'class-transformer';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { InfringementVerificationProvider } from '@config/infringement';
import { ApiProperty } from '@nestjs/swagger';

export class PartialInfringementDetailsDto {
    @IsNumberString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiProperty()
    noticeNumber?: string;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiProperty()
    brn?: string;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiProperty()
    vehicle?: string;

    @IsIn(Object.keys(InfringementVerificationProvider))
    @IsOptional()
    @ApiProperty({ enum: InfringementVerificationProvider })
    provider?: string; // The crawler to use on the system

    @IsOptional()
    @ApiProperty()
    issuerCode?: string; // The code of the issuer as existing on the system

    @IsOptional()
    @ApiProperty()
    issuerName?: string; // The name of the issuer as existing on the system

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiProperty()
    caseNumber?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    issuerStatus?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    issuerStatusDescription?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    reason?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    reasonCode?: string;

    @IsIn(Object.values(InfringementType))
    @IsOptional()
    @ApiProperty({ enum: InfringementType })
    type?: InfringementType;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asCurrency(asString(val)))
    @ApiProperty()
    amountDue?: string;

    @IsNumberString()
    @IsOptional()
    @Transform((val) => asCurrency(asString(val)))
    @ApiProperty()
    originalAmount?: string;

    @FixDate()
    @IsDateString()
    @IsOptional()
    @ApiProperty()
    offenceDate?: string;

    @FixDate()
    @IsDateString()
    @IsOptional()
    @ApiProperty()
    latestPaymentDate?: string;
}
