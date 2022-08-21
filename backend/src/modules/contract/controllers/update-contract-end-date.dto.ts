import { IsBoolean, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';

export class UpdateContractEndDateDto {
    @IsDefined()
    @ApiProperty({ description: 'The new contract start date', example: moment().toISOString() })
    @FixDate()
    startDate?: string;

    @IsOptional()
    @ApiProperty({
        description: 'The new contract end date',
        example: moment().add('1', 'month').toISOString(),
    })
    @FixDate()
    endDate?: string;
}
