import { DocumentTemplate, DocumentTemplateForm } from '~/models/document-template.model';

export class GeneratedDocument {
    generatedDocumentId!: number;
    documentTemplate!: DocumentTemplate;
    form!: DocumentTemplateForm;
    complete!: boolean;
}
