import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { DocumentTemplate } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteDocumentTemplateService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteDocumentTemplate(id: number): Promise<DocumentTemplate> {
        this.logger.log({ message: 'Deleting Document Template:', detail: id, fn: this.deleteDocumentTemplate.name });
        const documentTemplate = await DocumentTemplate.findOne(id);
        this.logger.log({ message: 'Found Document Template:', detail: id, fn: this.deleteDocumentTemplate.name });
        if (!documentTemplate) {
            this.logger.warn({ message: 'Could not find Document Template to delete', detail: id, fn: this.deleteDocumentTemplate.name });
            throw new BadRequestException(ERROR_CODES.E005_CouldNotFindDocumentTemplateToDelete.message());
        }

        await DocumentTemplate.remove(documentTemplate);
        this.logger.log({ message: 'Deleted Document Template:', detail: id, fn: this.deleteDocumentTemplate.name });
        return DocumentTemplate.create({ documentTemplateId: id });
    }

    async softDeleteDocumentTemplate(id: number): Promise<DocumentTemplate> {
        this.logger.log({ message: 'Soft Deleting Document Template:', detail: id, fn: this.deleteDocumentTemplate.name });
        const documentTemplate = await DocumentTemplate.findOne(id);
        this.logger.log({ message: 'Found Document Template:', detail: id, fn: this.deleteDocumentTemplate.name });
        if (!documentTemplate) {
            this.logger.warn({ message: 'Could not find Document Template to delete', detail: id, fn: this.deleteDocumentTemplate.name });
            throw new BadRequestException(ERROR_CODES.E005_CouldNotFindDocumentTemplateToDelete.message());
        }

        // documentTemplate.active = false; // FIXME
        await documentTemplate.save();
        this.logger.log({ message: 'Soft Deleted Document Template:', detail: id, fn: this.deleteDocumentTemplate.name });
        return documentTemplate;
    }
}
