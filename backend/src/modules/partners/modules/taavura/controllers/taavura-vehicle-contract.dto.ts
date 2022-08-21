import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';

/* tslint:disable:variable-name */

export enum VehicleContractIntent {
    VehicleLease = 'Vehicle and Lease Contract',
    VehicleOwnership = 'Vehicle and Ownership Details',
    VehicleLeaseAndOwnership = 'Vehicle, Lease Contract and Ownership Details',
    VehicleOwnershipReturn = 'No changes necessary for Customer Vehicle return to Taavura, Ownership Details already exist',
    None = 'None - no valid request has been made',
}

export class TaavuraVehicleContractDto {
    // VEHICLE
    @IsString()
    @IsDefined({
        groups: [
            VehicleContractIntent.VehicleLease,
            VehicleContractIntent.VehicleOwnership,
            VehicleContractIntent.VehicleLeaseAndOwnership,
        ],
    })
    @ApiProperty({ description: 'The vehicle number, or vehicle registration.', example: '65992101' })
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    veh_id: string;
    @IsString()
    @IsDefined({
        groups: [
            VehicleContractIntent.VehicleLease,
            VehicleContractIntent.VehicleOwnership,
            VehicleContractIntent.VehicleLeaseAndOwnership,
        ],
    })
    @ApiProperty({ description: 'The vehicle manufacturer', example: 'DAF' })
    veh_vendor: string;
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The vehicle model', example: 'FA LF210H12' })
    veh_model?: string;
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The year the vehicle was produced', example: '2017' })
    veh_year?: string;
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The colour of the vehicle', example: 'H3279WHTE' })
    veh_color?: string;
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The vehicle category', example: 'light truck 5-10-15' })
    veh_category?: string;
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'The vehicle weight in kilograms', example: 2500 })
    veh_weight?: number;

    // OWNERSHIP
    @IsOptional()
    @IsDefined({
        groups: [
            VehicleContractIntent.VehicleLease,
            VehicleContractIntent.VehicleOwnership,
            VehicleContractIntent.VehicleLeaseAndOwnership,
        ],
    })
    @IsString()
    @ApiProperty({ description: 'The BRN (business registration number) of the owner of the vehicle', example: '512562422' })
    @Transform((val) => asString(val))
    veh_owner_id?: string;
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleOwnership, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'The date of ownership start', example: '2020-05-10' })
    @FixDate()
    veh_owner_start?: string;
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleOwnership, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'The date of ownership end', example: '2026-12-31' })
    @FixDate()
    veh_owner_end?: string;
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleOwnership, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'Internal Taavura Contract ID linking vehicles to owners', example: '12629' })
    owner_update_id?: string;

    // LEASE
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleLease, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'The BRN of the user of the vehicle as in the lease contract', example: '510953904' })
    @Transform((val) => asString(val))
    veh_end_cust_id?: string;
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleLease, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'The start date of the lease contract', example: '2020-05-17' })
    @FixDate()
    veh_end_cust_start?: string;
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleLease, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'The end date of the lease contract', example: '2027-05-16' })
    @FixDate()
    veh_end_cust_end?: string;
    @IsOptional()
    @IsDefined({ groups: [VehicleContractIntent.VehicleLease, VehicleContractIntent.VehicleLeaseAndOwnership] })
    @IsString()
    @ApiProperty({ description: 'Internal Taavura Contract ID linking vehicles to customers', example: '13176' })
    contract_update_id?: string;

    // PDF
    @ApiProperty({ description: 'Contract PDF Document (Base 64)', example: 'ASdbBASd271DbashASdbabg' })
    @IsString()
    @IsOptional()
    contract_string?: string;
}
