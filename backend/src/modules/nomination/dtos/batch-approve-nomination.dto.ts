import { IsDefined, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchApproveNominationDto {
    @IsInt({ each: true })
    @IsDefined()
    @ApiProperty({ description: 'An array of nominationIds to approve for payment' })
    nominationIds: number[];
}
