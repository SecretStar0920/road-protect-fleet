import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';

export class CreateDriverContractDto {
    @IsString()
    @ApiProperty({ description: 'The driver start date', required: true, example: moment().toISOString() })
    @FixDate()
    startDate: string;
    @IsOptional()
    @ApiProperty({
        description: 'The driver end date',
        required: false,
        example: moment().add('2', 'weeks').toISOString(),
    })
    @FixDate()
    endDate?: string;
    @IsDefined()
    @ApiProperty({ description: 'The driver license number or id number' })
    driver: string;
    @IsDefined()
    @ApiProperty({ description: 'The vehicle registration', required: true, example: '37178283' })
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    vehicle: number | string;
    @IsOptional()
    @ApiProperty({ description: 'The documentId for the driver document', required: false })
    document?: number;
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
    })
    reference?: string;
}
