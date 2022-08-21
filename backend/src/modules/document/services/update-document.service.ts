import { Injectable } from '@nestjs/common';
import { UpdateDocumentDto } from '@modules/document/controllers/document.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { Document } from '@entities';

@Injectable()
export class UpdateDocumentService {
    constructor(private logger: Logger) {}

    async updateDocument(id: number, dto: UpdateDocumentDto): Promise<Document> {
        this.logger.log({ message: 'Updating Document: ', detail: merge({ id }, dto), fn: this.updateDocument.name });
        let document = await Document.findOne(id);
        document = merge(document, dto);
        await document.save();
        this.logger.log({ message: 'Updated Document: ', detail: id, fn: this.updateDocument.name });
        return document;
    }
}
