import { IsString } from 'class-validator';

export class UpdateAccountUserDto {
    @IsString()
    roleNames?: string[];
}
