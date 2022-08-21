import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import 'reflect-metadata';
import { SpreadsheetMetadata } from '@modules/shared/dtos/spreadsheet-config';
import { VehicleType } from '@modules/shared/models/entities/vehicle.model';

export class CreateVehicleDto {
    @IsDefined()
    @SpreadsheetMetadata({ required: true })
    registration: string;
    @IsString()
    @IsDefined()
    @SpreadsheetMetadata({ required: true })
    manufacturer: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    model: string;
    @IsOptional()
    @SpreadsheetMetadata()
    modelYear: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    color: string;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    category: string;
    @IsNumber()
    @IsOptional()
    @SpreadsheetMetadata()
    weight: number;
    @IsString()
    @IsOptional()
    @SpreadsheetMetadata()
    type: VehicleType;
}
