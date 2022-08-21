import { IsDefined, IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
    @IsDefined()
    @IsString()
    newPassword: string; // This password should be SHA512 hashed prior to sending

    @IsOptional()
    @IsString()
    email: string;
}
