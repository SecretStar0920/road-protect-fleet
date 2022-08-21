import { IsDateString, IsDefined } from 'class-validator';

export class CreateContractDto {
    @IsDateString()
    startDate: string;
    @IsDateString()
    endDate: string;
    @IsDefined()
    user: number | string;
    @IsDefined()
    owner: number | string;
    @IsDefined()
    vehicle: number | string;
}
