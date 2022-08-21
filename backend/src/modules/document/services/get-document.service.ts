import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@logger';
import { Document } from '@entities';
import { promises as fs } from 'fs';
import { Config } from '@config/config';
import * as path from 'path';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export interface DocumentFileDto {
    file: Buffer;
    document: Document;
}

@Injectable()
export class GetDocumentService {
    constructor(private logger: Logger) {}

    async getDocuments(documentIds: number[]): Promise<Document[]> {
        this.logger.log({ message: `Getting Document with ids: `, detail: documentIds, fn: this.getDocument.name });
        const documents = await Document.findByIds(documentIds);
        if (!documents || documents.length < documentIds.length) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message({ documentIds }) });
        }

        this.logger.log({ message: `Found Document with ids: `, detail: documentIds, fn: this.getDocument.name });
        return documents;
    }

    async getDocument(documentId: number): Promise<Document> {
        this.logger.log({ message: `Getting Document with id: `, detail: documentId, fn: this.getDocument.name });
        const document = await Document.findOne(documentId);
        if (!document) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message({ documentId }) });
        }
        this.logger.log({ message: `Found Document with id: `, detail: document.documentId, fn: this.getDocument.name });
        return document;
    }

    async getDocumentFile(documentId: number): Promise<DocumentFileDto> {
        this.logger.debug({ message: 'Getting document file:', detail: { documentId }, fn: this.getDocumentFile.name });
        const document = await Document.createQueryBuilder('document').where('document.documentId = :documentId', { documentId }).getOne();

        if (!document) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message({ documentId }) });
        }

        let file: Buffer;

        try {
            file = await fs.readFile(Config.get.storageDirectory(path.join(document.fileDirectory, document.storageName)));
        } catch (e) {
            this.logger.error({
                message: `Could not load the file provided [${documentId}], it is probably missing`,
                detail: e,
                fn: this.getDocumentFile.name,
            });
            throw new InternalServerErrorException({ message: ERROR_CODES.E045_FailedToLoadDocument.message(), error: e });
        }

        return {
            file,
            document,
        };
    }
}
