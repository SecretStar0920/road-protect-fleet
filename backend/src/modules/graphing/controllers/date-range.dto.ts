import { IsOptional, IsString } from 'class-validator';

export class DateRangeDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;
}
