import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { trimString } from '@modules/shared/helpers/dto-transforms';

export class LoginDto {
    @IsDefined()
    @IsEmail()
    @ApiProperty({ description: 'Email address of user to login as' })
    @Transform((val) => trimString(val))
    @Transform((val) => val.toLowerCase())
    email: string;

    @IsDefined()
    @IsString()
    @ApiProperty({ description: 'SHA512 Hashed Password' })
    password: string;
}
