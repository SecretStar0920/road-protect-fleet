import { IsOptional } from 'class-validator';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Transform } from 'class-transformer';

export class InfringementCalendarQueryDto {
    @IsOptional()
    @Transform((val) => moment(val, 'YYYY-MM-DD'))
    date: Moment;
}
