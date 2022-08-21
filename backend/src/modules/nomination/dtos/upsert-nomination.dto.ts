import { NominationType } from '@entities';
import { NominationDto } from '@modules/nomination/dtos/nomination.dto';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class UpsertNominationDto extends NominationDto {
    @IsInt()
    infringementId: number;

    @IsInt()
    accountId: number;

    @IsOptional()
    @IsIn(Object.values(NominationType))
    type?: NominationType = NominationType.Digital;
}
