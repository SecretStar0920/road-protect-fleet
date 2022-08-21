import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetIssuerService } from '@modules/issuer/services/get-issuer.service';
import { GetIssuersService } from '@modules/issuer/services/get-issuers.service';
import { CreateIssuerService } from '@modules/issuer/services/create-issuer.service';
import { UpdateIssuerService } from '@modules/issuer/services/update-issuer.service';
import { DeleteIssuerService } from '@modules/issuer/services/delete-issuer.service';
import { Issuer, IssuerType } from '@entities';
import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { asString } from '@modules/shared/helpers/dto-transforms';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { fixDate } from '@modules/shared/helpers/fix-date';
import { FixDate } from '@modules/shared/helpers/fix-date.transform';
import { IssuerIntegrationDetails } from '@modules/shared/models/issuer-integration-details.model';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';

export class UpdateIssuerDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The name of the issuer' })
    name: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The address of the issuer' })
    address: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The email address of the issuer' })
    email: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The redirection email address of the issuer' })
    redirectionEmail: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The fax number of the issuer' })
    fax: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The telephone number of the issuer' })
    telephone: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The email address for a contact person of the issuer' })
    contactPerson: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The software provider for the issuer' })
    provider: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The code used by the software provider for the issuer' })
    code: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The external code/rashut used by the software provider for the issuer' })
    externalCode: string;
    @IsString()
    @FixDate()
    @IsOptional()
    @ApiPropertyOptional({ description: 'The latest information received from the issuer date' })
    latestInfoDate?: string;
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ description: 'External payment link' })
    externalPaymentLink?: string;
    @IsString()
    @IsOptional()
    integrationDetails: string | IssuerIntegrationDetails;
}

export class CreateIssuerDto {
    @IsString()
    @IsDefined()
    @ApiProperty()
    name: string;
    @IsString()
    @IsDefined()
    @ApiProperty()
    @Transform((val) => asString(val))
    code: string;
    @IsOptional()
    @IsIn(Object.values(IssuerType))
    @ApiProperty()
    type: IssuerType;
    @IsString()
    @IsOptional()
    @ApiProperty()
    address: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    fax: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    telephone: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    contactPerson: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    provider: string;
    @IsString()
    @IsOptional()
    authority: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    redirectionEmail: string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    externalPaymentLink: string;
}

@Controller('issuer')
@UseGuards(UserAuthGuard)
@ApiBearerAuth()
export class IssuerController {
    constructor(
        private getIssuerService: GetIssuerService,
        private getIssuersService: GetIssuersService,
        private createIssuerService: CreateIssuerService,
        private updateIssuerService: UpdateIssuerService,
        private deleteIssuerService: DeleteIssuerService,
    ) {}

    @Get('/police')
    async getPoliceIssuer(): Promise<Issuer> {
        return this.getIssuersService.getPoliceIssuer();
    }

    @Get(':issuerId')
    async getIssuer(@Param('issuerId') issuerId: number): Promise<Issuer> {
        return this.getIssuerService.getIssuer(issuerId);
    }

    @Get()
    async getIssuers(): Promise<Issuer[]> {
        return this.getIssuersService.getIssuers();
    }

    @Post()
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async createIssuer(@Body() dto: CreateIssuerDto): Promise<Issuer> {
        return this.createIssuerService.createIssuer(dto);
    }

    @Post(':issuerId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async updateIssuer(@Param('issuerId') issuerId: number, @Body() dto: UpdateIssuerDto): Promise<Issuer> {
        return this.updateIssuerService.updateIssuer(issuerId, dto);
    }

    @Delete(':issuerId')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async deleteIssuer(@Param('issuerId') issuerId: number): Promise<Issuer> {
        return this.deleteIssuerService.deleteIssuer(issuerId);
    }

    @Delete(':issuerId/soft')
    @UseGuards(SystemAdminGuard)
    @ApiExcludeEndpoint()
    async softDeleteIssuer(@Param('issuerId') issuerId: number): Promise<Issuer> {
        return this.deleteIssuerService.softDeleteIssuer(issuerId);
    }
}
