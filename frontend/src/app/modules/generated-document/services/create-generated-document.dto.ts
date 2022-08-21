import { IsOptional, IsString } from 'class-validator';

export class CreateGeneratedDocumentDto {
    @IsString()
    documentTemplateName: string;

    @IsOptional()
    accountId?: number;

    @IsOptional()
    contractId?: number;

    @IsOptional()
    infringementId?: number;
}
