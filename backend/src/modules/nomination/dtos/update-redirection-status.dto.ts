import { IsBoolean, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRedirectionStatusDto {
    @IsDefined()
    @IsBoolean()
    @ApiProperty({ description: 'Whether the redirection is approved or not' })
    approved: boolean;
}
