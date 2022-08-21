import { IsBoolean, IsDateString, IsDefined, IsNumber, IsOptional } from 'class-validator';

export class UpdateContractDocumentDto {
    @IsNumber()
    @IsOptional()
    documentId?: string;
}

export class UpdateContractEndDateDto {
    @IsDateString()
    @IsDefined()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;
}
