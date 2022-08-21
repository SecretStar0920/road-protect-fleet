import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class NgxDataPoint {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsNumber()
    value: number;

    @IsOptional()
    extra?: { cost?: number; colour?: string; router?: string[]; params?: any };
}

export class NgxSeriesData {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    series: NgxDataPoint[];
}
