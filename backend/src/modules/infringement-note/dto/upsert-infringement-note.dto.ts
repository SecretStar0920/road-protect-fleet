import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Account, Infringement } from '@entities';

export class UpsertInfringementNoteDto {
    @IsOptional()
    @IsString()
    value?: string;

    @IsOptional()
    @IsNumber()
    infringementId?: number;

    @IsOptional()
    createdBy?: Account;

    @IsOptional()
    infringement?: Infringement;

    @IsOptional()
    adminNote?: boolean
}
