import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { AccountType } from '@modules/shared/models/entities/account-type.enum';
import { AccountRole } from '@modules/shared/models/entities/account.model';

export class UpdateAccountV1Dto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    identifier?: string;

    @IsString()
    @IsOptional()
    type?: AccountType;

    @IsBoolean()
    @IsOptional()
    isVerified?: boolean;

    @IsBoolean()
    @IsOptional()
    managed?: boolean;

    @IsEmail()
    @IsOptional()
    primaryContact?: string;

    @IsOptional()
    @IsString()
    contactName?: string;

    @IsOptional()
    @IsString()
    contactTelephone?: string;

    @IsOptional()
    @IsString()
    contactFax?: string;

    @IsString()
    @IsOptional()
    role?: AccountRole;

    @IsNumber()
    @IsOptional()
    documentId?: number;

    // @see CreateLocationDto
    @IsString()
    @IsOptional()
    streetName?: string = undefined;

    @IsString()
    @IsOptional()
    streetNumber?: string = undefined;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    code?: string;
}
