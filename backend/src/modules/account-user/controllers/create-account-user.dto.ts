import { IsArray, IsDefined, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAccountUserDto {
    @Transform((val) => val.toLowerCase())
    @IsEmail(undefined, { message: '$value is not a valid email address' })
    @ApiProperty({ description: 'The email of the user' })
    userEmail: string;

    @IsString({
        message: "The user's name must be a text value. Received $value",
    })
    @ApiProperty({ description: 'The name of the user' })
    userName: string;

    @IsString({
        message: "The user's surname must be a text value. Received $value",
    })
    @ApiProperty({ description: 'The surname of the user' })
    userSurname: string;

    @IsDefined({
        message: "The user's account must be defined",
    })
    @ApiProperty({ description: 'The account id of the account to add the user to' })
    account: number | string;

    @IsDefined()
    @ApiProperty({ description: 'The roles of the user' })
    roleNames: string[];
}
