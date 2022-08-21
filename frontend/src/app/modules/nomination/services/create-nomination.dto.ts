import { IsString } from 'class-validator';

export class CreateNominationDto {
    @IsString()
    infringement: string;

    @IsString()
    account: string;
}
