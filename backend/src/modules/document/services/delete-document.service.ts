import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { ContractOcrStatus, ContractType, Document, LeaseContract } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { ContractOcrStatusService } from '@modules/contract/services/contract-ocr-status.service';

@Injectable()
export class DeleteDocumentService {
    constructor(private logger: Logger, private contractOcrStatusService: ContractOcrStatusService) {}

    /**
     * Hard delete
     */
    async deleteDocument(id: number): Promise<Document> {
        this.logger.log({ message: 'Deleting Document:', detail: id, fn: this.deleteDocument.name });
        const document = await Document.createQueryBuilder('document')
            .leftJoinAndSelect('document.contract', 'contract')
            .where('document.documentId = :id', { id })
            .getOne();
        this.logger.log({ message: 'Found Document:', detail: id, fn: this.deleteDocument.name });
        if (!document) {
            this.logger.warn({ message: 'Could not find Document to delete', detail: id, fn: this.deleteDocument.name });
            throw new BadRequestException({ message: ERROR_CODES.E047_CouldNotFindDocumentToDelete.message() });
        }

        if (document.contract?.type === ContractType.Lease) {
            const contract = document.contract as LeaseContract;
            contract.ocrStatus = ContractOcrStatus.Incomplete;
            await contract.save();
        }
        await Document.remove(document);
        this.logger.log({ message: 'Deleted Document:', detail: id, fn: this.deleteDocument.name });
        return Document.create({ documentId: id });
    }

    async softDelete(id: number): Promise<Document> {
        this.logger.log({ message: 'Soft Deleting Document:', detail: id, fn: this.deleteDocument.name });
        const document = await Document.createQueryBuilder('document').where('document.documentId = :id', { id }).getOne();
        this.logger.log({ message: 'Found Document:', detail: id, fn: this.deleteDocument.name });
        if (!document) {
            this.logger.warn({ message: 'Could not find Document to delete', detail: id, fn: this.deleteDocument.name });
            throw new BadRequestException({ message: ERROR_CODES.E047_CouldNotFindDocumentToDelete.message() });
        }

        // document.active = false;
        await document.save();
        this.logger.log({ message: 'Soft Deleted Document:', detail: id, fn: this.deleteDocument.name });
        return document;
    }
}
