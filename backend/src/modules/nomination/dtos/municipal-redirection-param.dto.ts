import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MunicipalRedirectionParamDto {
    @IsNumber()
    @Transform((val) => (!isNaN(val) ? Number(val) : val))
    @ApiProperty({ description: 'The nominationId of the nomination to redirect' })
    nominationId: number;
}
