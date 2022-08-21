import { DocumentTemplateForm } from '@modules/shared/models/entities/document-template.model';
import { IsDefined } from 'class-validator';

export class UpdateGeneratedDocumentDto {
    @IsDefined()
    form: DocumentTemplateForm;
}
