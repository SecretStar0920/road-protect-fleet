import { Timestamped } from '@modules/shared/models/timestamped';
import { DocumentTemplate, DocumentTemplateForm } from '@modules/shared/models/entities/document-template.model';
import { Type } from 'class-transformer';
import { Document } from '@modules/shared/models/entities/document.model';

export class GeneratedDocument extends Timestamped {
    generatedDocumentId: number;

    @Type(() => DocumentTemplate)
    documentTemplate: DocumentTemplate;
    @Type(() => DocumentTemplateForm)
    form: DocumentTemplateForm;
    complete: boolean;

    @Type(() => Document)
    document: Document;
}
