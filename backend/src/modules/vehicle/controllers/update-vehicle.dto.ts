import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';
import { Transform } from 'class-transformer';
import { VehicleType } from '@entities';

export class UpdateVehicleDto {
    @IsOptional()
    @Transform((val: string) => {
        return vehicleRegistrationFormat(val);
    })
    @ApiPropertyOptional({ description: 'The vehicle registration number', example: '51729193' })
    registration?: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The vehicle manufacturer', example: 'Ford' })
    manufacturer?: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The vehicle model', example: 'F40', required: false })
    model?: string;
    @IsOptional()
    @ApiPropertyOptional({ description: 'The year the vehicle was manufactured', example: '2012', required: false })
    modelYear?: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The vehicle color', example: 'gold', required: false })
    color?: string;
    @IsString()
    @IsOptional()
    @Transform((val) => asString(val))
    @ApiPropertyOptional({ description: 'The vehicle category class', example: 'car 1-5', required: false })
    category?: string;
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The vehicle weight in tonnes', example: '1.9', required: false })
    weight?: number;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The type of vehicle in the fleet', example: 'Private', required: false })
    @IsIn(Object.values(VehicleType))
    type?: VehicleType;
}
