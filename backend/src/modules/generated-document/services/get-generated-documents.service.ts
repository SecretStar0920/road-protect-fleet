import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { GeneratedDocument } from '@entities';

@Injectable()
export class GetGeneratedDocumentsService {
    constructor(private logger: Logger) {}

    async getGeneratedDocuments(): Promise<GeneratedDocument[]> {
        this.logger.log({ message: `Getting Generated Documents`, detail: null, fn: this.getGeneratedDocuments.name });
        const generatedDocuments = await GeneratedDocument.findWithMinimalRelations().getMany();
        this.logger.log({
            message: `Found Generated Documents, length: `,
            detail: generatedDocuments.length,
            fn: this.getGeneratedDocuments.name,
        });
        return generatedDocuments;
    }
}
