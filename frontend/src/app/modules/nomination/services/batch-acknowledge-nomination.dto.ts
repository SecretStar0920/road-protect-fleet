import { IsDefined, IsInt } from 'class-validator';

export class BatchAcknowledgeNominationDto {
    @IsInt({ each: true })
    @IsDefined()
    nominationIds: number[];

    @IsDefined()
    acknowledgedFor: { [action: string]: boolean };
}
