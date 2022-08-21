import { IsDefined, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchMunicipalRedirectionDto {
    @IsInt({ each: true })
    @IsDefined()
    @ApiProperty({ description: 'An array of nominationIds to redirect' })
    nominationIds: number[];
}
