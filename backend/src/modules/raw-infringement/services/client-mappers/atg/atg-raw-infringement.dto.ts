import { Trim } from '@modules/shared/helpers/trim.transform';
import { IsOptional, IsString } from 'class-validator';

export class AtgRawInfringementDto {
    @IsString()
    @Trim()
    customer: string;

    @IsString()
    @Trim()
    carNumber: string;

    @IsString()
    @Trim()
    ticketNumber: string;

    @IsString()
    @Trim()
    dtViolationTime: string;

    @IsString()
    @Trim()
    streetName: string;

    @IsString()
    @Trim()
    violationNearTo: string;

    @IsString()
    @Trim()
    @IsOptional()
    houseNumber?: string;

    @IsString()
    @Trim()
    localLawNumber: string;

    @IsString()
    @IsOptional()
    @Trim()
    description: string;

    @IsString()
    @Trim()
    carType: string;

    @IsString()
    @IsOptional()
    @Trim()
    manufacturer: string;

    @IsString()
    @Trim()
    amount: string;

    @IsString()
    @Trim()
    penaltyAmount: string;

    @IsString()
    @Trim()
    lastDateToPay: string;

    @IsString()
    @Trim()
    inspectorNumber: string;

    @IsString()
    @Trim()
    inspectorName: string;
}
