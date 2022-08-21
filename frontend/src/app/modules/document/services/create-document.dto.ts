import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDocumentDto {
    @IsUUID('4')
    @IsOptional()
    storageName?: string;

    @IsString()
    @IsOptional()
    fileName: string;

    @IsString()
    @IsOptional()
    fileDirectory: string;
}
