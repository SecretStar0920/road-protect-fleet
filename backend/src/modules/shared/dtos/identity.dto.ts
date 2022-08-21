import { User } from '@entities';
import { IsDefined, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdentityDto {
    @IsNumber()
    @ApiProperty()
    accountId?: number;
    @IsNumber()
    @ApiProperty()
    accountUserId?: number;
    @IsDefined()
    @ApiProperty({ type: 'object', description: 'User' })
    user?: User;
}
