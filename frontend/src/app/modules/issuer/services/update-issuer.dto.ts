import { IsOptional, IsString } from 'class-validator';

export class UpdateIssuerDto {
    @IsString()
    @IsOptional()
    name: string;
    @IsString()
    @IsOptional()
    code: string;
    @IsString()
    @IsOptional()
    address: string;
    @IsString()
    @IsOptional()
    email: string;
    @IsString()
    @IsOptional()
    fax: string;
    @IsString()
    @IsOptional()
    telephone: string;
    @IsString()
    @IsOptional()
    contactPerson: string;
    @IsString()
    @IsOptional()
    redirectionEmail: string;
    @IsString()
    @IsOptional()
    externalPaymentLink: string;
    @IsString()
    @IsOptional()
    provider: string;
    @IsString()
    @IsOptional()
    integrationDetails: string;
}
