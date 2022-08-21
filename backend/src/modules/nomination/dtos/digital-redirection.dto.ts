import { IsDefined, IsIn, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NominationDetails, NominationTarget } from '@entities';
import { Type } from 'class-transformer';

export class DigitalRedirectionDto {
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The documentId of a created document to save with the redirection' })
    documentId?: number;

    @IsIn(Object.values(NominationTarget))
    @IsDefined()
    @ApiProperty({ description: 'The target of the redirection', enum: Object.values(NominationTarget) })
    to: NominationTarget;

    @IsOptional()
    @ValidateNested()
    @Type(() => NominationDetails)
    @ApiProperty({ description: 'Additional details to be stored regarding the nomination' })
    details?: NominationDetails;
}
