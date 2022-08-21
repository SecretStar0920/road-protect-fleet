import { IsIn, IsOptional, IsString } from 'class-validator';
import { NominationStatus } from '@modules/shared/models/entities/nomination.model';

export class UpdateNominationDto {
    @IsString()
    @IsOptional()
    infringement?: string;

    @IsString()
    @IsOptional()
    account?: string;

    @IsIn(Object.values(NominationStatus))
    @IsOptional()
    status?: NominationStatus;
}
