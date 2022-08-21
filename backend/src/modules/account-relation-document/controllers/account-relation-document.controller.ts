import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetAccountRelationDocumentService } from '@modules/account-relation-document/services/get-account-relation-document.service';
import { GetAccountRelationDocumentsService } from '@modules/account-relation-document/services/get-account-relation-documents.service';
import { CreateAccountRelationDocumentService } from '@modules/account-relation-document/services/create-account-relation-document.service';
import { UpdateAccountRelationDocumentService } from '@modules/account-relation-document/services/update-account-relation-document.service';
import { DeleteAccountRelationDocumentService } from '@modules/account-relation-document/services/delete-account-relation-document.service';
import { AccountRelationDocument, AccountRelationDocumentType } from '@entities';
import { IsIn, IsNumber } from 'class-validator';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

export class UpdateAccountRelationDocumentDto {
    // Insert Properties
}

export class CreateAccountRelationDocumentDto {
    @IsNumber()
    accountRelationId: number;
    @IsNumber()
    documentId: number;
    @IsIn(Object.values(AccountRelationDocumentType))
    type: AccountRelationDocumentType;
}

@Controller('account-relation-document')
@UseGuards(UserAuthGuard)
export class AccountRelationDocumentController {
    constructor(
        private getAccountRelationDocumentService: GetAccountRelationDocumentService,
        private getAccountRelationDocumentsService: GetAccountRelationDocumentsService,
        private createAccountRelationDocumentService: CreateAccountRelationDocumentService,
        private updateAccountRelationDocumentService: UpdateAccountRelationDocumentService,
        private deleteAccountRelationDocumentService: DeleteAccountRelationDocumentService,
    ) {}

    @Get()
    async getAccountRelationDocuments(): Promise<AccountRelationDocument[]> {
        return await this.getAccountRelationDocumentsService.getAccountRelationDocuments();
    }

    @Get('relation/:relationId')
    async getAccountRelationDocumentsForRelation(@Param('relationId') relationId: number): Promise<AccountRelationDocument[]> {
        return await this.getAccountRelationDocumentsService.getAccountRelationDocumentsForRelation(relationId);
    }

    @Get(':accountRelationDocumentId')
    async getAccountRelationDocument(
        @Param('accountRelationDocumentId') accountRelationDocumentId: number,
    ): Promise<AccountRelationDocument> {
        return await this.getAccountRelationDocumentService.getAccountRelationDocument(accountRelationDocumentId);
    }

    @Post()
    async createAccountRelationDocument(@Body() dto: CreateAccountRelationDocumentDto): Promise<AccountRelationDocument> {
        return await this.createAccountRelationDocumentService.createAccountRelationDocument(dto);
    }

    @Post(':accountRelationDocumentId')
    async updateAccountRelationDocument(
        @Param('accountRelationDocumentId') accountRelationDocumentId: number,
        @Body() dto: UpdateAccountRelationDocumentDto,
    ): Promise<AccountRelationDocument> {
        return await this.updateAccountRelationDocumentService.updateAccountRelationDocument(accountRelationDocumentId, dto);
    }

    @Delete(':accountRelationDocumentId')
    async deleteAccountRelationDocument(
        @Param('accountRelationDocumentId') accountRelationDocumentId: number,
    ): Promise<AccountRelationDocument> {
        return await this.deleteAccountRelationDocumentService.deleteAccountRelationDocument(accountRelationDocumentId);
    }

    @Delete(':accountRelationDocumentId/soft')
    async softDeleteAccountRelationDocument(
        @Param('accountRelationDocumentId') accountRelationDocumentId: number,
    ): Promise<AccountRelationDocument> {
        return await this.deleteAccountRelationDocumentService.softDeleteAccountRelationDocument(accountRelationDocumentId);
    }
}
