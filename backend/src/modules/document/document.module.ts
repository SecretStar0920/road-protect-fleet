import { Module } from '@nestjs/common';
import { DocumentController } from './controllers/document.controller';
import { CreateDocumentService } from './services/create-document.service';
import { UpdateDocumentService } from './services/update-document.service';
import { GetDocumentService } from './services/get-document.service';
import { GetDocumentsService } from './services/get-documents.service';
import { DeleteDocumentService } from './services/delete-document.service';
import { LinkDocumentService } from '@modules/document/services/link-document.service';
import { MergePdfDocumentService } from '@modules/document/services/merge-pdf-document.service';
import { PublicDocumentController } from '@modules/document/controllers/public-document.controller';
import { ContractOcrIntegration } from '@integrations/contract/contract-ocr.integration';
import { CreateZippedFolderService } from '@modules/document/services/create-zipped-folder.service';
import { ContractOcrStatusService } from '@modules/contract/services/contract-ocr-status.service';

@Module({
    controllers: [DocumentController, PublicDocumentController],
    providers: [
        CreateDocumentService,
        UpdateDocumentService,
        GetDocumentService,
        GetDocumentsService,
        DeleteDocumentService,
        LinkDocumentService,
        ContractOcrStatusService,
        ContractOcrIntegration,
        MergePdfDocumentService,
        CreateZippedFolderService,
    ],
    imports: [],
    exports: [CreateDocumentService, LinkDocumentService, CreateZippedFolderService, MergePdfDocumentService, GetDocumentService],
})
export class DocumentModule {}
