import { IsDefined, IsOptional } from 'class-validator';

export class ManualPayNominationDto {
    // See ManualPaymentDto
    @IsOptional()
    documentId: number;

    @IsDefined()
    referenceNumber: string;

    @IsOptional()
    details: any;

    @IsOptional()
    amountPaid: string;
}
