import { DateRangeDto } from '@modules/graphing/controllers/date-range.dto';
import { IsBoolean, IsDefined } from 'class-validator';

export class GetSummaryIndicatorsDto {
    @IsDefined()
    dateRange: DateRangeDto;

    @IsDefined()
    @IsBoolean()
    isDateComparison: boolean;
}
