import { IsDefined, IsIn, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NominationTarget } from '@entities';

export class BatchDigitalRedirectionDto {
    @IsInt({ each: true })
    @IsDefined()
    @ApiProperty({ description: 'An array of nominationIds to redirect' })
    nominationIds: number[];

    @IsIn(Object.values(NominationTarget))
    @ApiProperty({ description: 'The target of the redirections', enum: Object.values(NominationTarget) })
    to: NominationTarget;
}
