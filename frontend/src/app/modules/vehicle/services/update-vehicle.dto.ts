import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateVehicleDto {
    @IsOptional()
    registration?: string = undefined;
    @IsString()
    @IsOptional()
    manufacturer?: string = undefined;
    @IsString()
    @IsOptional()
    model?: string = undefined;
    @IsOptional()
    modelYear?: string = undefined;
    @IsString()
    @IsOptional()
    color?: string = undefined;
    @IsString()
    @IsOptional()
    category?: string = undefined;
    @IsNumber()
    @IsOptional()
    weight?: number = undefined;
    // @IsIn(Object.values(AutoAssignTo))
    // @IsOptional()
    // autoAssignTo?: AutoAssignTo = undefined;

    @IsOptional()
    user?: number | string = undefined;
    @IsOptional()
    owner?: number | string = undefined;
    @IsDateString()
    @IsOptional()
    leaseStartDate?: string = undefined;
    @IsDateString()
    @IsOptional()
    leaseEndDate?: string = undefined;
}
