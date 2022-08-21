import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract, ContractOcrStatus, ContractType, LeaseContract } from '@entities';
import * as moment from 'moment';
import { ContractOcrIntegration } from '@integrations/contract/contract-ocr.integration';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { GetDocumentService } from '@modules/document/services/get-document.service';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { BulkContractOcrDto } from '@modules/contract/controllers/bulk-contract-ocr.dto';

@Injectable()
export class ContractOcrStatusService {
    constructor(
        private logger: Logger,
        private contractOcrService: ContractOcrIntegration,
        private getDocumentService: GetDocumentService,
    ) {}

    async bulkRunOcrByContractId(dto: BulkContractOcrDto): Promise<Contract[]> {
        const updatedContracts: Contract[] = [];
        for (const id of dto.contractIds) {
            try {
                const contract = await this.runOcrByContractId(id);
                updatedContracts.push(contract);
            } catch (e) {
                this.logger.warn({
                    message: 'Failed to run ocr for contract',
                    detail: {
                        error: e.message,
                        stack: e.stack,
                    },
                    fn: this.bulkRunOcrByContractId.name,
                });
            }
        }
        return updatedContracts;
    }

    async runOcrByContractId(contractId: number) {
        this.logger.debug({ message: 'Setting OCR statuses', detail: { contractId }, fn: this.runOcrByContractId.name });
        const contract = await LeaseContract.findById(contractId);

        if (!contract.document) {
            throw new BadRequestException({ message: ERROR_CODES.E044_CouldNotFindDocument.message({ documentId: 'undefined' }) });
        }

        const document = await this.getDocumentService.getDocumentFile(contract.document.documentId);
        const multerFile: Partial<MulterFile> = {
            fieldname: document.document.fileName,
            originalname: document.document.fileName,
            buffer: document.file,
        };
        const ocrResults = await this.contractOcrService.retrieveContractOCR(multerFile);
        if (ocrResults) {
            const doc = await this.getDocumentService.getDocument(contract.document.documentId);
            doc.ocr = ocrResults;
            await doc.save();
        }
        return this.setOcrStatus(contractId);
    }

    async setOcrStatus(contractId: number) {
        const contract = await LeaseContract.findWithMinimalRelations()
            .andWhere('contract.contractId = :contractId', { contractId })
            .getOne();
        this.logger.debug({
            message: 'Setting OCR status',
            detail: {
                contractId,
                contractToOcr: {
                    vehicle: `[${contract.vehicle?.registration}] to [${contract.document?.ocr?.car}]`,
                    startDate: `[${moment(contract.startDate).endOf('day').toISOString()}] to [${moment(contract.document?.ocr?.start)
                        .endOf('day')
                        .toISOString()}]`,
                    endDate: `[${moment(contract.endDate).endOf('day').toISOString()}] to [${moment(contract.document?.ocr?.end)
                        .endOf('day')
                        .toISOString()}]`,
                    owner: `[${contract.owner?.identifier}] to [${contract.document?.ocr?.owner}]`,
                    user: `[${contract.user?.identifier}] to [${contract.document?.ocr?.customer}]`,
                },
            },
            fn: this.setOcrStatus.name,
        });
        if (contract.type !== ContractType.Lease) {
            if (!!contract.ocrStatus) {
                contract.ocrStatus = null;
                await contract.save();
            }
        } else if (!contract.document || !contract.document?.ocr) {
            contract.ocrStatus = ContractOcrStatus.Incomplete;
            await contract.save();
        } else if (
            contract.document.ocr.car === contract.vehicle?.registration &&
            this.isSameDate(contract.document.ocr.start, contract.startDate) &&
            this.isSameDate(contract.document.ocr.end, contract.endDate) &&
            contract.document.ocr.owner === contract.owner?.identifier &&
            contract.document.ocr.customer === contract.user?.identifier
        ) {
            // If the OCR does match the contract details then the status should be successful
            contract.ocrStatus = ContractOcrStatus.Success;
            await contract.save();
        } else if (
            contract.document.ocr.car === contract.vehicle?.registration &&
            this.isSameDate(contract.document.ocr.start, contract.startDate) &&
            !this.isSameDate(contract.document.ocr.end, contract.endDate) &&
            contract.document.ocr.owner === contract.owner?.identifier &&
            contract.document.ocr.customer === contract.user?.identifier
        ) {
            // If the OCR does match the contract details except for the end date then the status should be modified
            contract.ocrStatus = ContractOcrStatus.Modified;
            await contract.save();
        } else if (
            contract.document.ocr.car !== contract.vehicle?.registration ||
            !this.isSameDate(contract.document.ocr.start, contract.startDate) ||
            !this.isSameDate(contract.document.ocr.end, contract.endDate) ||
            contract.document.ocr.owner !== contract.owner?.identifier ||
            contract.document.ocr.customer !== contract.user?.identifier
        ) {
            // If the OCR does not match the contract details then the status should be failed
            contract.ocrStatus = ContractOcrStatus.Failed;
            await contract.save();
        }
        this.logger.debug({
            message: 'Setting OCR statuses',
            detail: { contractId: contract.contractId, ocrStatus: contract.ocrStatus },
            fn: this.setOcrStatus.name,
        });
        return contract;
    }

    async fixOcrStatuses(): Promise<string[]> {
        this.logger.debug({ message: 'Fixing incorrect OCR statuses', fn: this.fixOcrStatuses.name });

        const modifiedContracts: string[] = [];

        // Contracts that should have incomplete statuses
        const allLeaseContracts = await LeaseContract.findWithMinimalRelations().andWhere('contract.document IS NOT NULL').getMany();

        this.logger.debug({
            message: `Found ${allLeaseContracts.length} lease contracts`,
            fn: this.fixOcrStatuses.name,
        });

        for (const contract of allLeaseContracts) {
            const updatedContract = await this.setOcrStatus(contract.contractId);
            if (updatedContract) {
                modifiedContracts.push(`${contract.contractId} to ${contract.ocrStatus}`);
            }
        }
        return modifiedContracts;
    }

    isSameDate(date1: string, date2: string) {
        return moment(date1).endOf('day').isSame(moment(date2).endOf('day'));
    }
}
