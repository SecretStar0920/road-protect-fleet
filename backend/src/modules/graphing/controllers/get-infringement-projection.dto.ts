import { DateRangeDto } from '@modules/graphing/controllers/date-range.dto';
import { IsDefined, IsIn } from 'class-validator';

export enum InfringementPredictionEndpoints {
    Owner = 'owner',
    User = 'user',
    Hybrid = 'hybrid',
}

export class GetInfringementProjectionDto {
    @IsDefined()
    dateRange: DateRangeDto;

    @IsDefined()
    @IsIn(Object.values(InfringementPredictionEndpoints))
    endpoint: InfringementPredictionEndpoints;
}
