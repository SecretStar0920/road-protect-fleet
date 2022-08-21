import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { asString, vehicleRegistrationFormat } from '@modules/shared/helpers/dto-transforms';

export class CreateOwnershipContractDto {
    @IsString()
    @ApiProperty({ description: 'The ownership start date', required: true, example: moment().toISOString() })
    @FixDate()
    startDate: string;
    @IsOptional()
    @ApiProperty({
        description: 'The ownership end date',
        required: false,
        example: moment().add('2', 'weeks').toISOString(),
    })
    @FixDate()
    endDate?: string;
    @IsDefined()
    @ApiProperty({ description: 'The lease contract owner BRN', example: '57283819237' })
    owner: string;
    @IsDefined()
    @ApiProperty({ description: 'The vehicle registration', required: true, example: '37178283' })
    @Transform((val) => vehicleRegistrationFormat(asString(val)))
    vehicle: number | string;
    @IsOptional()
    @ApiProperty({ description: 'The documentId for the license document', required: false })
    document?: number;
    @IsOptional()
    @ApiProperty({
        description: 'An optional reference Id for linking to batch file upload or your system Id',
        required: false,
    })
    reference?: string;
}
