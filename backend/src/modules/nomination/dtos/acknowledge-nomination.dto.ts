import { IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcknowledgeNominationDto {
    @IsDefined()
    @ApiProperty({ description: 'What actions should be applicable to this nomination?' })
    acknowledgedFor: { [action: string]: boolean };
}
