import { Module } from '@nestjs/common';
import { GeneratedDocumentController } from './controllers/generated-document.controller';
import { CreateGeneratedDocumentService } from './services/create-generated-document.service';
import { UpdateGeneratedDocumentService } from './services/update-generated-document.service';
import { GetGeneratedDocumentService } from './services/get-generated-document.service';
import { GetGeneratedDocumentsService } from './services/get-generated-documents.service';
import { DeleteGeneratedDocumentService } from './services/delete-generated-document.service';
import { RenderGeneratedDocumentService } from '@modules/generated-document/services/render-generated-document.service';
import { ConfirmGeneratedDocumentService } from '@modules/generated-document/services/confirm-generated-document.service';
import { DocumentModule } from '@modules/document/document.module';

@Module({
    controllers: [GeneratedDocumentController],
    providers: [
        CreateGeneratedDocumentService,
        UpdateGeneratedDocumentService,
        GetGeneratedDocumentService,
        GetGeneratedDocumentsService,
        DeleteGeneratedDocumentService,
        RenderGeneratedDocumentService,
        ConfirmGeneratedDocumentService,
    ],
    imports: [DocumentModule],
    exports: [RenderGeneratedDocumentService, CreateGeneratedDocumentService],
})
export class GeneratedDocumentModule {}
