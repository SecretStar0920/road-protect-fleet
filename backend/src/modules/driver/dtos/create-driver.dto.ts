import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreatePhysicalLocationDto, CreatePostalLocationDto } from '@modules/location/controllers/create-location-detailed.dto';

export class CreateDriverDto {
    @IsDefined()
    @ApiProperty()
    name: string;

    @IsDefined()
    @ApiProperty()
    surname: string;

    @IsDefined()
    @ApiProperty()
    idNumber: string;

    @IsDefined()
    @ApiProperty()
    licenseNumber: string;

    @IsOptional()
    @ApiProperty()
    email?: string;

    @IsOptional()
    @ApiProperty()
    cellphoneNumber?: string;

    @ValidateNested()
    @IsOptional()
    @Type(() => CreatePhysicalLocationDto)
    physicalLocation?: CreatePhysicalLocationDto;

    @ValidateNested()
    @IsOptional()
    @Type(() => CreatePostalLocationDto)
    postalLocation?: CreatePostalLocationDto;
}
