import { IsDefined, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchAcknowledgeNominationDto {
    @IsInt({ each: true })
    @IsDefined()
    @ApiProperty({ description: 'An array of nominationIds to acknowledge' })
    nominationIds: number[];

    @IsDefined()
    @ApiProperty({ description: 'What actions should be applicable to this nomination?' })
    acknowledgedFor: { [action: string]: boolean };
}
