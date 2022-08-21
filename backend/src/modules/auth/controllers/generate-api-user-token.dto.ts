import { IsDefined, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateApiUserTokenDto {
    @IsDefined()
    @IsEmail()
    @ApiProperty({ description: 'Email address of the API User' })
    email: string;
}
