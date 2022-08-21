import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { Transform } from 'class-transformer';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';

export class UpdateDriverContractDto {
    @IsOptional()
    @ApiProperty({ description: 'The documentId for the driver document', required: false })
    document?: number;
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
    })
    reference?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The driver contract start date', required: true, example: moment().toISOString() })
    @FixDate()
    startDate?: string;

    @IsString()
    @ApiProperty({
        description: 'The driver contract end date',
        required: false,
        example: moment().add('2', 'weeks').toISOString(),
    })
    @FixDate()
    @IsOptional()
    endDate?: string;

    @IsOptional()
    @ApiProperty({ description: 'The driver license number or id number' })
    driver?: string;

    @IsOptional()
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    @ApiProperty({ description: 'The driver contract vehicle registration', required: true, example: '37178283' })
    vehicle?: string;

    @IsOptional()
    @IsString()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;
}
