import { IsDefined, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from '@modules/shared/helpers/dto-transforms';

export class ForgotPasswordRequestDto {
    @IsDefined()
    @IsEmail()
    @Transform((val) => trimString(val))
    email: string;
}
