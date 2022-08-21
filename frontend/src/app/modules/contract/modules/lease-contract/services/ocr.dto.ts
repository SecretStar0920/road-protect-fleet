import { IsDateString, IsDefined, IsOptional } from 'class-validator';

export class OcrDto {
    @IsDateString()
    startDate: string;
    @IsDateString()
    endDate: string;
    @IsDefined()
    user: string | number;
    @IsDefined()
    owner: string | number;
    @IsDefined()
    vehicle: string;
}
