import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';

export enum ReportingEndpoints {
    Owner = 'owner',
    User = 'user',
    All = 'all',
}

export class GraphingDataDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsDefined()
    @IsIn(Object.values(ReportingEndpoints))
    endpoint?: ReportingEndpoints;
}
