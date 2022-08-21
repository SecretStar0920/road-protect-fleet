import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { asInteger } from '@modules/shared/helpers/dto-transforms';

export class GetRedirectionDetailsParamDto {
    @IsInt()
    @Transform((val) => asInteger(val))
    infringementId: number;
}
