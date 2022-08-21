import { Module } from '@nestjs/common';
import { AccountRelationDocumentController } from './controllers/account-relation-document.controller';
import { CreateAccountRelationDocumentService } from './services/create-account-relation-document.service';
import { UpdateAccountRelationDocumentService } from './services/update-account-relation-document.service';
import { GetAccountRelationDocumentService } from './services/get-account-relation-document.service';
import { GetAccountRelationDocumentsService } from './services/get-account-relation-documents.service';
import { DeleteAccountRelationDocumentService } from './services/delete-account-relation-document.service';

@Module({
    controllers: [AccountRelationDocumentController],
    providers: [
        CreateAccountRelationDocumentService,
        UpdateAccountRelationDocumentService,
        GetAccountRelationDocumentService,
        GetAccountRelationDocumentsService,
        DeleteAccountRelationDocumentService,
    ],
    imports: [],
})
export class AccountRelationDocumentModule {}
