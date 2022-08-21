import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { DocumentTemplate } from '@entities';

@Injectable()
export class GetDocumentTemplatesService {
    constructor(private logger: Logger) {}

    async getDocumentTemplates(): Promise<DocumentTemplate[]> {
        this.logger.log({ message: `Getting Document Templates`, detail: null, fn: this.getDocumentTemplates.name });
        const documentTemplates = await DocumentTemplate.createQueryBuilder('documentTemplate').getMany();
        this.logger.log({
            message: `Found Document Templates, length: `,
            detail: documentTemplates.length,
            fn: this.getDocumentTemplates.name,
        });
        return documentTemplates;
    }
}
