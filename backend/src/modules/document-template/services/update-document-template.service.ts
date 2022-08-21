import { Injectable } from '@nestjs/common';
import { UpdateDocumentTemplateDto } from '@modules/document-template/controllers/document-template.controller';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { DocumentTemplate } from '@entities';

@Injectable()
export class UpdateDocumentTemplateService {
    constructor(private logger: Logger) {}

    async updateDocumentTemplate(id: number, dto: UpdateDocumentTemplateDto): Promise<DocumentTemplate> {
        this.logger.log({ message: 'Updating Document Template: ', detail: merge({ id }, dto), fn: this.updateDocumentTemplate.name });
        let documentTemplate = await DocumentTemplate.createQueryBuilder('documentTemplate')
            .where('documentTemplate.documentTemplateId = :id', { id })
            .getOne();
        documentTemplate = merge(documentTemplate, dto);
        documentTemplate.form = dto.form;
        await documentTemplate.save();
        this.logger.log({ message: 'Updated Document Template: ', detail: id, fn: this.updateDocumentTemplate.name });
        return documentTemplate;
    }
}
