import { IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Moment } from 'moment';

export class InfringementStatusReportingDto {
    @IsDefined()
    @Transform((val) => val.map((dateItem) => moment(dateItem, 'YYYY-MM-DD')))
    createdRange: Moment[];
    @IsDefined()
    @Transform((val) => val.map((dateItem) => moment(dateItem, 'YYYY-MM-DD')))
    paymentRange: Moment[];
}
