import { Module } from '@nestjs/common';
import { DocumentTemplateController } from './controllers/document-template.controller';
import { CreateDocumentTemplateService } from './services/create-document-template.service';
import { UpdateDocumentTemplateService } from './services/update-document-template.service';
import { GetDocumentTemplateService } from './services/get-document-template.service';
import { GetDocumentTemplatesService } from './services/get-document-templates.service';
import { DeleteDocumentTemplateService } from './services/delete-document-template.service';

@Module({
    controllers: [DocumentTemplateController],
    providers: [
        CreateDocumentTemplateService,
        UpdateDocumentTemplateService,
        GetDocumentTemplateService,
        GetDocumentTemplatesService,
        DeleteDocumentTemplateService,
    ],
    imports: [],
    exports: [CreateDocumentTemplateService],
})
export class DocumentTemplateModule {}
