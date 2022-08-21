import { IsDefined, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchApproveInfringementDto {
    @IsInt({ each: true })
    @IsDefined()
    @ApiProperty({ description: 'An array of infringementIds to approve for payment' })
    infringementIds: number[];
}
