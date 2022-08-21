import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { asCurrency } from '@modules/shared/helpers/dto-transforms';

export class ManualPayNominationDto {
    @IsOptional()
    @ApiPropertyOptional({ description: 'The documentId of a created document to save with the proof of payment' })
    documentId: number;

    @IsDefined()
    @ApiProperty({ description: 'A reference number for the payment' })
    referenceNumber: string;

    @IsOptional()
    @ApiProperty({ description: 'Additional details for the payment', required: false })
    details: any;

    @IsOptional()
    @ApiProperty({ description: 'Amount paid for the payment', required: false })
    @Transform((val) => asCurrency(val))
    amountPaid: string;
}
