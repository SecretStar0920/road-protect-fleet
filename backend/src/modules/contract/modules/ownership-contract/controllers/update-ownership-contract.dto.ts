import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { Transform } from 'class-transformer';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';

export class UpdateOwnershipContractDto {
    @IsOptional()
    @ApiProperty({ description: 'The documentId for the license document', required: false })
    document?: number;
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
    })
    reference?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The ownership contract start date', required: true, example: moment().toISOString() })
    @FixDate()
    startDate?: string;

    @IsString()
    @ApiProperty({
        description: 'The ownership contract end date',
        required: false,
        example: moment().add('2', 'weeks').toISOString(),
    })
    @FixDate()
    @IsOptional()
    endDate?: string;

    @IsOptional()
    @ApiProperty({ description: 'The ownership contract owner BRN', example: '57283819237' })
    owner?: string;

    @IsOptional()
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    @ApiProperty({ description: 'The ownership contract vehicle registration', required: true, example: '37178283' })
    vehicle?: string;

    @IsOptional()
    @IsString()
    // NOTE: this is not a field, but it is used to compute the correct time for spreadsheet upload and is appended in the backend
    timezone?: string;
}
