import { LoginDto } from '@modules/auth/controllers/login.dto';
import { IsDefined, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from '@modules/shared/helpers/dto-transforms';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithRecaptchaDto extends LoginDto {
    @IsString()
    @Transform((val) => trimString(val))
    @IsDefined()
    @ApiProperty({ description: 'Google Recaptcha Key' })
    recaptchaKey: string;
}
