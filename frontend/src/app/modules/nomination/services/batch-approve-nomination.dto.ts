import { IsDefined, IsInt } from 'class-validator';

export class BatchApproveNominationDto {
    @IsInt({ each: true })
    @IsDefined()
    nominationIds: number[];
}
