import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { asBoolean } from '@modules/shared/helpers/dto-transforms';

export class ManualInfringementRedirectionDto {
    @IsOptional()
    @Expose()
    user?: string;

    @IsString()
    @Expose()
    noticeNumber: string;

    @IsString()
    @Expose()
    issuer: string;

    @IsBoolean()
    @Expose()
    @Transform((val) => asBoolean(val))
    complete: boolean;
}

export class ManualInfringementRedirectionSpreadsheetDto {
    @IsOptional()
    @Expose()
    user?: string;

    @IsString()
    @Expose()
    noticeNumber: string;

    @IsString()
    @Expose()
    issuer: string;

    @IsBoolean()
    @Expose()
    @Transform((val) => asBoolean(val))
    complete: boolean;
}
