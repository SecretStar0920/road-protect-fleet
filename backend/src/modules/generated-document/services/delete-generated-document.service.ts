import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { GeneratedDocument } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class DeleteGeneratedDocumentService {
    constructor(private logger: Logger) {}

    /**
     * Hard delete
     */
    async deleteGeneratedDocument(id: number): Promise<GeneratedDocument> {
        this.logger.log({ message: 'Deleting Generated Document:', detail: id, fn: this.deleteGeneratedDocument.name });
        const generatedDocument = await GeneratedDocument.findOne(id);
        this.logger.log({ message: 'Found Generated Document:', detail: id, fn: this.deleteGeneratedDocument.name });
        if (!generatedDocument) {
            this.logger.warn({ message: 'Could not find Generated Document to delete', detail: id, fn: this.deleteGeneratedDocument.name });
            throw new BadRequestException(ERROR_CODES.E003_CouldNotFindGeneratedDocumentToDelete.message());
        }

        await GeneratedDocument.remove(generatedDocument);
        this.logger.log({ message: 'Deleted Generated Document:', detail: id, fn: this.deleteGeneratedDocument.name });
        return GeneratedDocument.create({ generatedDocumentId: id });
    }

    async softDeleteGeneratedDocument(id: number): Promise<GeneratedDocument> {
        this.logger.log({ message: 'Soft Deleting Generated Document:', detail: id, fn: this.deleteGeneratedDocument.name });
        const generatedDocument = await GeneratedDocument.findOne(id);
        this.logger.log({ message: 'Found Generated Document:', detail: id, fn: this.deleteGeneratedDocument.name });
        if (!generatedDocument) {
            this.logger.warn({ message: 'Could not find Generated Document to delete', detail: id, fn: this.deleteGeneratedDocument.name });
            throw new BadRequestException(ERROR_CODES.E003_CouldNotFindGeneratedDocumentToDelete.message());
        }

        // generatedDocument.active = false; // FIXME
        await generatedDocument.save();
        this.logger.log({ message: 'Soft Deleted Generated Document:', detail: id, fn: this.deleteGeneratedDocument.name });
        return generatedDocument;
    }
}
