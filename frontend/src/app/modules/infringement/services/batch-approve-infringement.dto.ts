import { IsDefined, IsInt } from 'class-validator';

export class BatchApproveInfringementDto {
    @IsInt({ each: true })
    @IsDefined()
    infringementIds: number[];
}
