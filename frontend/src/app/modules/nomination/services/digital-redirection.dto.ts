import { IsDefined, IsIn, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { NominationDetails } from '@modules/shared/models/entities/nomination.model';
import { Type } from 'class-transformer';
import { NominationTarget } from '@modules/shared/models/entities/vehicle.model';

export class DigitalRedirectionDto {
    @IsNumber()
    @IsOptional()
    documentId: number;

    @IsIn(Object.values(NominationTarget))
    @IsDefined()
    to: NominationTarget;

    @IsOptional()
    @ValidateNested()
    @Type(() => NominationDetails)
    details: NominationDetails;
}
