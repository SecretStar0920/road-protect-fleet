import { IsDefined, IsIn, IsInt } from 'class-validator';
import { NominationTarget } from '@modules/shared/models/entities/vehicle.model';

export class BatchDigitallyRedirectNominationDto {
    @IsInt({ each: true })
    @IsDefined()
    nominationIds: number[];

    @IsIn(Object.values(NominationTarget))
    to: NominationTarget;
}
