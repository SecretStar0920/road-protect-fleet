import { IsBoolean, IsDefined } from 'class-validator';

export class UpdateRedirectionStatusDto {
    @IsDefined()
    @IsBoolean()
    approved: boolean;
}
