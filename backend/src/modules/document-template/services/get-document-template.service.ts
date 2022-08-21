import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { DocumentTemplate } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetDocumentTemplateService {
    constructor(private logger: Logger) {}

    async getDocumentTemplate(documentTemplateId: number): Promise<DocumentTemplate> {
        this.logger.log({ message: `Getting DocumentTemplate with id: `, detail: documentTemplateId, fn: this.getDocumentTemplate.name });
        const documentTemplate = await DocumentTemplate.createQueryBuilder('documentTemplate')
            .andWhere('documentTemplate.documentTemplateId = :id', { id: documentTemplateId })
            .getOne();
        if (!documentTemplate) {
            throw new BadRequestException(ERROR_CODES.E015_CouldNotFindDocumentTemplate.message({ documentTemplateId }));
        }
        this.logger.log({
            message: `Found DocumentTemplate with id: `,
            detail: documentTemplate.documentTemplateId,
            fn: this.getDocumentTemplate.name,
        });
        return documentTemplate;
    }
}
