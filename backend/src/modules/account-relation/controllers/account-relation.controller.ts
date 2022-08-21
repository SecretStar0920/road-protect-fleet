import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetAccountRelationService } from '@modules/account-relation/services/get-account-relation.service';
import { GetAccountRelationsService } from '@modules/account-relation/services/get-account-relations.service';
import { CreateAccountRelationService } from '@modules/account-relation/services/create-account-relation.service';
import { UpdateAccountRelationService } from '@modules/account-relation/services/update-account-relation.service';
import { DeleteAccountRelationService } from '@modules/account-relation/services/delete-account-relation.service';
import { AccountRelation } from '@entities';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateAccountRelationService } from '@modules/account-relation/services/generate-account-relation.service';
import { Identity } from '@modules/shared/decorators/identity.decorator';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';
import { Permissions } from '@modules/auth/guards/permission.guard';
import { PERMISSIONS } from '@modules/shared/models/permissions.const';
import { FileInterceptor } from '@nestjs/platform-express';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class AccountRelationDataDto {
    @IsString()
    @IsDefined()
    summary: string;

    @IsDefined()
    customFields: any;
}

export class UpdateAccountRelationDto {
    @Type(() => AccountRelationDataDto)
    @ValidateNested()
    data: AccountRelationDataDto;
}

export class CreateAccountRelationDto {
    @IsNumber()
    forwardAccountId: number;
    @IsNumber()
    reverseAccountId: number;

    @Type(() => AccountRelationDataDto)
    @ValidateNested()
    data: AccountRelationDataDto;
}

@Controller('account-relation')
@UseGuards(UserAuthGuard)
export class AccountRelationController {
    constructor(
        private getAccountRelationService: GetAccountRelationService,
        private getAccountRelationsService: GetAccountRelationsService,
        private createAccountRelationService: CreateAccountRelationService,
        private updateAccountRelationService: UpdateAccountRelationService,
        private deleteAccountRelationService: DeleteAccountRelationService,
        private generateAccountRelationService: GenerateAccountRelationService,
        private antivirusService: AntivirusService,
    ) {}

    @Get(':accountRelationId')
    @Permissions(PERMISSIONS.ViewAccountRelation)
    async getAccountRelation(@Param('accountRelationId') accountRelationId: number): Promise<AccountRelation> {
        return await this.getAccountRelationService.getAccountRelation(accountRelationId);
    }

    @Get()
    @Permissions(PERMISSIONS.ViewAccountRelation)
    async getAccountRelations(): Promise<AccountRelation[]> {
        return await this.getAccountRelationsService.getAccountRelations();
    }

    @Post()
    @Permissions(PERMISSIONS.CreateAccountRelation)
    async createAccountRelation(@Body() dto: CreateAccountRelationDto): Promise<AccountRelation> {
        return await this.createAccountRelationService.createAccountRelation(dto);
    }

    @Post('generate/contracts')
    @Permissions(PERMISSIONS.CreateAccountRelation)
    async generateFromContracts(@Identity() identity: IdentityDto): Promise<AccountRelation[]> {
        return await this.generateAccountRelationService.generateAccountRelationsFromContracts(identity.accountId);
    }

    @Post('generate/spreadsheet')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fieldSize: 25 * 1024 * 1024,
            },
        }),
    )
    @Permissions(PERMISSIONS.CreateAccountRelation, PERMISSIONS.EditAccountRelation, PERMISSIONS.DeleteAccountRelation)
    async generateFromSpreadSheet(
        @Identity() identity: IdentityDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<AccountRelation[]> {
        await this.antivirusService.scanBuffer(file.buffer);
        return await this.generateAccountRelationService.generateAccountRelationsFromSpreadsheet(identity.accountId, file);
    }

    @Post(':accountRelationId')
    @Permissions(PERMISSIONS.EditAccountRelation)
    async updateAccountRelation(
        @Param('accountRelationId') accountRelationId: number,
        @Body() dto: UpdateAccountRelationDto,
    ): Promise<AccountRelation> {
        return await this.updateAccountRelationService.updateAccountRelation(accountRelationId, dto);
    }

    @Delete(':accountRelationId')
    @Permissions(PERMISSIONS.DeleteAccountRelation)
    async deleteAccountRelation(@Param('accountRelationId') accountRelationId: number): Promise<AccountRelation> {
        return await this.deleteAccountRelationService.deleteAccountRelation(accountRelationId);
    }

    @Delete(':accountRelationId/soft')
    @Permissions(PERMISSIONS.DeleteAccountRelation)
    async softDeleteAccountRelation(@Param('accountRelationId') accountRelationId: number): Promise<AccountRelation> {
        return await this.deleteAccountRelationService.softDeleteAccountRelation(accountRelationId);
    }
}
