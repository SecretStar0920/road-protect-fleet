import { IsDefined, IsString } from 'class-validator';

export class ForgotPasswordConfirmDto {
    @IsDefined()
    @IsString()
    newPassword: string; // SHA512 Password
    @IsDefined()
    @IsString()
    jwt: string;
}
