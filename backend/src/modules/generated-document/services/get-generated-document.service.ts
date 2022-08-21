import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { GeneratedDocument } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetGeneratedDocumentService {
    constructor(private logger: Logger) {}

    async getGeneratedDocument(generatedDocumentId: number): Promise<GeneratedDocument> {
        this.logger.log({
            message: `Getting GeneratedDocument with id: `,
            detail: generatedDocumentId,
            fn: this.getGeneratedDocument.name,
        });
        const generatedDocument = await GeneratedDocument.findWithMinimalRelations()
            .andWhere('generatedDocument.generatedDocumentId = :id', { id: generatedDocumentId })
            .getOne();
        if (!generatedDocument) {
            throw new BadRequestException(ERROR_CODES.E016_CouldNotFindGeneratedDocument.message({ generatedDocumentId }));
        }
        this.logger.log({
            message: `Found GeneratedDocument with id: `,
            detail: generatedDocument.generatedDocumentId,
            fn: this.getGeneratedDocument.name,
        });
        return generatedDocument;
    }
}
