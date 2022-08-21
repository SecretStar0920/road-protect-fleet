import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import * as moment from 'moment';
import { Config } from '@config/config';
import { Transform } from 'class-transformer';
import { asInteger } from '@modules/shared/helpers/dto-transforms';

export class AccountInfringementReportDto {
    @IsNumber()
    @Transform((val) => asInteger(val))
    accountId: number;

    @IsOptional()
    @IsDateString()
    queryDate: string = moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString();
}

export class AccountRelationInfringementReportDto {
    @IsNumber()
    @Transform((val) => asInteger(val))
    accountRelationId: number;

    @IsOptional()
    @IsDateString()
    queryDate: string = moment().add(`-${Config.get.infringementReportConfig.reportingPeriodInDays}`, 'day').toISOString();
}
