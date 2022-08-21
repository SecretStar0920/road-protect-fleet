import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInfringementNoteDto {
    @IsString()
    value: string;

    @IsNumber()
    infringementId: number;

    @IsBoolean()
    @IsOptional()
    adminNote?: boolean;
}
