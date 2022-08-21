import { IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { trimString } from '@modules/shared/helpers/dto-transforms';
import { CreateLocationDetailedDto } from '@modules/location/controllers/create-location-detailed.dto';

export class CreateDriverSpreadsheetDto extends CreateLocationDetailedDto {
    @IsDefined()
    @ApiProperty()
    @Transform((val) => trimString(val))
    name: string;

    @IsDefined()
    @ApiProperty()
    @Transform((val) => trimString(val))
    surname: string;

    @IsDefined()
    @ApiProperty()
    @Transform((val) => trimString(val))
    idNumber: string;

    @IsDefined()
    @ApiProperty()
    @Transform((val) => trimString(val))
    licenseNumber: string;

    @IsOptional()
    @ApiProperty()
    @Transform((val) => trimString(val))
    email?: string;

    @IsOptional()
    @ApiProperty()
    @Transform((val) => trimString(val))
    cellphoneNumber?: string;
}
