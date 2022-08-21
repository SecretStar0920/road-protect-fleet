import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Document } from '@entities';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { DocumentFileDto, GetDocumentService } from '@modules/document/services/get-document.service';
import { documentApi } from '@modules/shared/models/document-api.model';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
/**
 * Uses the document api to merge provided document entities and return a new Document
 */
export class MergePdfDocumentService {
    constructor(
        private logger: Logger,
        @Inject(forwardRef(() => CreateDocumentService))
        private createDocumentService: CreateDocumentService,
        private getDocumentService: GetDocumentService,
    ) {}

    @Transactional()
    async mergeAndSave(documents: Document[]): Promise<Document> {
        this.logger.debug({ message: 'Merging documents', detail: documents.map((d) => d.documentId), fn: this.mergeAndSave.name });
        // Get the document PDFs
        const documentFiles: DocumentFileDto[] = [];
        for (const document of documents) {
            documentFiles.push(await this.getDocumentService.getDocumentFile(document.documentId));
        }
        this.logger.debug({ message: 'Loaded document files', detail: documents.map((d) => d.documentId), fn: this.mergeAndSave.name });

        // Make merge request to document API
        let mergedPdf: Buffer;
        try {
            mergedPdf = await documentApi.mergePdfs(documentFiles);
            this.logger.debug({ message: 'Merged document files', detail: documents.map((d) => d.documentId), fn: this.mergeAndSave.name });
        } catch (e) {
            this.logger.error({ message: 'Failed to merge document files', detail: e, fn: this.mergeAndSave.name });
            throw new Error(ERROR_CODES.E164_FailedToMergePdf.message({ error: e }));
        }




        const createdDocument = await this.createDocumentService.saveDocumentFileAndCreate(
            {
                fileDirectory: 'merged-documents',
                fileName: `merged-document-${documents.map((d) => d.documentId).join('_')}.pdf`,
            },
            mergedPdf,
        );

        return createdDocument;
    }



    @Transactional()
    async merge(documents: Document[]): Promise<Buffer> {
        this.logger.debug({ message: 'Merging documents', detail: documents.map((d) => d.documentId), fn: this.merge.name });
        // Get the document PDFs
        const documentFiles: DocumentFileDto[] = [];
        for (const document of documents) {
            documentFiles.push(await this.getDocumentService.getDocumentFile(document.documentId));
        }
        this.logger.debug({ message: 'Loaded document files', detail: documents.map((d) => d.documentId), fn: this.merge.name });

        // Make merge request to document API
        let mergedPdf: Buffer;
        try {
            mergedPdf = await documentApi.mergePdfs(documentFiles);
            this.logger.debug({ message: 'Merged document files', detail: documents.map((d) => d.documentId), fn: this.merge.name });
        } catch (e) {
            this.logger.error({ message: 'Failed to merge document files', detail: e, fn: this.merge.name });
            throw new Error(ERROR_CODES.E164_FailedToMergePdf.message({ error: e }));
        }

        return mergedPdf;
    }
}
