import { IsDefined } from 'class-validator';

export class AcknowledgeNominationDto {
    @IsDefined()
    acknowledgedFor: { [action: string]: boolean };
}
