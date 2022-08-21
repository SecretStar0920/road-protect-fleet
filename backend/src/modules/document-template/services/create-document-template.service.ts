import { Injectable } from '@nestjs/common';
import { CreateDocumentTemplateDto } from '@modules/document-template/controllers/document-template.controller';
import { Logger } from '@logger';
import { DocumentTemplate } from '@entities';
import { getManager } from 'typeorm';

@Injectable()
export class CreateDocumentTemplateService {
    constructor(private logger: Logger) {}

    async createDocumentTemplate(dto: CreateDocumentTemplateDto): Promise<DocumentTemplate> {
        this.logger.debug({ message: 'Creating Document Template', detail: dto, fn: this.createDocumentTemplate.name });
        const documentTemplate = await getManager().transaction(async (transaction) => {
            const created = await this.createOnly(dto);
            const saved = await transaction.save(created);
            return saved;
        });
        this.logger.debug({ message: 'Saved Document Template', detail: documentTemplate, fn: this.createDocumentTemplate.name });
        return documentTemplate;
    }

    async createOnly(dto: CreateDocumentTemplateDto): Promise<DocumentTemplate> {
        return DocumentTemplate.create(dto);
    }
}
