import { Injectable } from '@nestjs/common';
import { UpdateGeneratedDocumentDto } from '@modules/generated-document/controllers/generated-document.controller';
import { Logger } from '@logger';
import { GeneratedDocument } from '@entities';

@Injectable()
export class UpdateGeneratedDocumentService {
    constructor(private logger: Logger) {}

    async updateGeneratedDocument(id: number, dto: UpdateGeneratedDocumentDto): Promise<GeneratedDocument> {
        this.logger.log({ message: 'Updating Generated Document: ', detail: id, fn: this.updateGeneratedDocument.name });
        const generatedDocument = await GeneratedDocument.createQueryBuilder('generatedDocument')
            .where('generatedDocument.generatedDocumentId = :id', { id })
            .getOne();
        // generatedDocument = merge(generatedDocument, dto);
        generatedDocument.form = dto.form;
        await generatedDocument.save();
        this.logger.log({ message: 'Updated Generated Document: ', detail: id, fn: this.updateGeneratedDocument.name });
        return generatedDocument;
    }
}
