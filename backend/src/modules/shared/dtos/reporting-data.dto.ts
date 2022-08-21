import { SingleSeries } from '@modules/shared/dtos/chart-data.model';
import { IsDefined } from 'class-validator';

export class ReportingDataDto<T = SingleSeries> {
    @IsDefined()
    data: T;
}
