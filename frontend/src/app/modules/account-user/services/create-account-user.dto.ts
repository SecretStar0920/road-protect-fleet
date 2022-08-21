import { IsDefined, IsEmail, IsString } from 'class-validator';

export class CreateAccountUserDto {
    @IsEmail(undefined, { message: '$value is not a valid email address' })
    userEmail: string;

    @IsString({
        message: `The user's name must be a text value, received $value`,
    })
    userName: string;

    @IsString({
        message: `The user's surname must be a text value, received $value`,
    })
    userSurname: string;

    @IsDefined({
        message: 'The users account must be defined',
    })
    account: number | string;

    @IsString({
        message: 'An invalid role was provided, we expect a text value. Received $value',
    })
    roleNames: string[];
}
