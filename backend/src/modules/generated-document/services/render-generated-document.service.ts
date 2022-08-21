import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { GeneratedDocument } from '@entities';
import { isNil } from 'lodash';
import { documentApi } from '@modules/shared/models/document-api.model';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class RenderGeneratedDocumentService {
    constructor(
        private logger: Logger,
        @Inject(forwardRef(() => CreateDocumentService))
        private createDocumentService: CreateDocumentService,
    ) {}

    /**
     * Completes a generated document, renders the PDF, stores is as a document and returns the document
     */
    @Transactional()
    async renderGeneratedDocument(generatedDocumentId: number) {
        this.logger.debug({
            message: 'Rendering generated document',
            detail: { generatedDocumentId },
            fn: this.renderGeneratedDocument.name,
        });
        // Find
        let generatedDocument = await GeneratedDocument.findWithMinimalRelations()
            .where('generatedDocument.generatedDocumentId = :generatedDocumentId', { generatedDocumentId })
            .getOne();

        if (isNil(generatedDocument)) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message() });
        }

        // Send for renderering
        const url = `${generatedDocument.documentTemplate.url.replace(':id', `${generatedDocument.generatedDocumentId}`)}?lang=${
            generatedDocument.form.language
        }`;

        this.logger.debug({ message: 'url', detail: { url }, fn: this.renderGeneratedDocument.name });

        const fileBuffer: Buffer = await documentApi.urlToPdf(url);
        // Create document
        const document = await this.createDocumentService.saveDocumentFileAndCreate(
            {
                fileDirectory: 'generated-documents',
                fileName: `${generatedDocument.documentTemplate.name}-${generatedDocumentId}.pdf`,
            },
            fileBuffer,
        );

        generatedDocument.document = document;
        generatedDocument = await generatedDocument.save();
        return generatedDocument;
    }
}
