import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { GeneratedDocument } from '@entities';
import { isNil } from 'lodash';
import { LinkDocumentService } from '@modules/document/services/link-document.service';
import { LinkDocumentParamDto } from '@modules/document/controllers/document.controller';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class ConfirmGeneratedDocumentService {
    constructor(private logger: Logger, private linkDocumentService: LinkDocumentService) {}

    /**
     * Completes a generated document, renders the PDF, stores is as a document and returns the document
     */
    async confirmGeneratedDocument(generatedDocumentId: number, dto: LinkDocumentParamDto) {
        // Find
        const generatedDocument = await GeneratedDocument.findWithMinimalRelations()
            .where('generatedDocument.generatedDocumentId = :generatedDocumentId', { generatedDocumentId })
            .getOne();

        if (isNil(generatedDocument)) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message() });
        }

        await this.linkDocumentService.linkDocumentToEntity(dto);

        generatedDocument.complete = true;
        await generatedDocument.save();
        return generatedDocument;
    }
}
