import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Contract, ContractType, Document } from '@entities';
import { CreateDocumentService } from '@modules/document/services/create-document.service';
import * as unzipper from 'unzipper';
import * as fs from 'fs-extra';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { v4 } from 'uuid';
import { Config } from '@config/config';
import * as etl from 'etl';
import { isNil } from 'lodash';
import { CreateGeneratedDocumentService } from '@modules/generated-document/services/create-generated-document.service';
import { CreateGeneratedDocumentDto } from '@modules/generated-document/controllers/generated-document.controller';
import { RenderGeneratedDocumentService } from '@modules/generated-document/services/render-generated-document.service';
import { CreateZippedFolderService } from '@modules/document/services/create-zipped-folder.service';

export interface CreatedDocument {
    overwriteFile: boolean;
    document: Document;
    reference: string;
    contractId?: number;
}

@Injectable()
export class BatchUpdateContractDocumentService {
    private directory = 'generated-lease-contracts';

    constructor(
        private logger: Logger,
        private createDocumentService: CreateDocumentService,
        private createGeneratedDocumentService: CreateGeneratedDocumentService,
        private generateGeneratedDocumentService: RenderGeneratedDocumentService,
        private createZippedFolderService: CreateZippedFolderService,
    ) {}

    async batchUpdateContractDocuments(file: MulterFile, overwriteFile: boolean = false): Promise<CreatedDocument[]> {
        // Create documents
        const createdDocuments = await this.unzip(file, overwriteFile);
        return createdDocuments;
    }

    async unzip(file: MulterFile, overwriteFile: boolean = false): Promise<CreatedDocument[]> {
        const folder = 'batch-contract-documents';
        const folderUUID = v4();
        const directory = `${folder}/${folderUUID}`;
        const inputDirectory = `${directory}/input`;
        const outputDirectory = `${directory}/output`;

        this.logger.log({ message: 'Storing provided documents', detail: { inputDirectory, outputDirectory }, fn: this.unzip.name });

        // Create directories
        await this.createDirectory(Config.get.storageDirectory(`${inputDirectory}`));
        await this.createDirectory(Config.get.storageDirectory(`${outputDirectory}`));

        // Store zip
        await new Promise((resolve, reject) => {
            fs.writeFile(Config.get.storageDirectory(`${inputDirectory}/${file.originalname}`), file.buffer, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });

        this.logger.log({ message: 'Stored input ZIP file', detail: { filename: file.originalname }, fn: this.unzip.name });

        const createdDocuments: CreatedDocument[] = [];
        await fs
            .createReadStream(Config.get.storageDirectory(`${inputDirectory}/${file.originalname}`))
            .pipe(unzipper.Parse())
            .pipe(
                etl.map(async (entry) => {
                    if (entry.type === 'File') {
                        const buffer = await entry.buffer();
                        const filename = entry.path;
                        const createdDocument: CreatedDocument = await this.createDocumentAndLink(
                            buffer,
                            filename,
                            outputDirectory,
                            overwriteFile,
                        );
                        createdDocuments.push(createdDocument);
                    }
                }),
            )
            .promise();
        return createdDocuments;
    }

    async createDocumentAndLink(
        buffer: Buffer,
        filename: string,
        directory: string,
        overwriteFile: boolean = false,
    ): Promise<CreatedDocument> {
        const document = await this.createDocumentService.saveDocumentFileAndCreate(
            { fileName: filename, fileDirectory: directory },
            buffer,
        );

        // Remove extension from the filename
        filename = filename.split('/').slice(-1)[0].split('.')[0];
        // Find contracts where the reference is equal to the filename and update
        const contract = await Contract.findWithMinimalRelations().where('reference = :filename', { filename }).getOne();

        // Check found
        if (!isNil(contract) && (isNil(contract?.document) || (!isNil(contract?.document) && overwriteFile))) {
            this.logger.log({
                message: 'Found contract, updating document Id',
                detail: { overwriteFile, oldDocument: contract.document, newDocument: document.documentId },
                fn: this.createDocumentAndLink.name,
            });
            contract.document = document;
            await contract.save();
            return { overwriteFile, document, reference: filename, contractId: contract.contractId };
        }
        this.logger.error({
            message: `Could not find contract with reference ${filename}, did not link document ${document.documentId}`,
            fn: this.createDocumentAndLink.name,
        });
        return { overwriteFile, document, reference: filename };
    }

    async createDirectory(directory) {
        return fs.mkdirp(directory);
    }

    // Returns a zipped folder of generated lease documents
    async batchGenerateContractDocuments(contractIds: number[], representativeDetails: string): Promise<Document> {
        this.logger.log({
            message: 'Request to generating lease contract documents for contracts: ',
            detail: contractIds,
            fn: this.batchGenerateContractDocuments.name,
        });
        // Find all contracts
        let contracts = await Contract.findWithMinimalRelations()
            .andWhere('contract.contractId IN (:...ids)', { ids: contractIds })
            .getMany();
        // Remove ownership contracts if there are any
        contracts = contracts.filter((contract) => contract.type === ContractType.Lease);
        // Try to generate documents for all of them
        const generatedDocuments: Document[] = [];
        for (const contract of contracts) {
            const dto: CreateGeneratedDocumentDto = {
                documentTemplateName: 'LeaseSubstitute',
                contractId: contract.contractId,
            };
            try {
                // Create documents
                let generatedContract = await this.createGeneratedDocumentService.createGeneratedDocument(dto);
                generatedContract = await this.createGeneratedDocumentService.setRepresentativeDetails(
                    generatedContract,
                    representativeDetails,
                );
                generatedContract = await this.generateGeneratedDocumentService.renderGeneratedDocument(
                    generatedContract.generatedDocumentId,
                );
                if (generatedContract.document) {
                    // Renames the file so that it can be easily identified
                    generatedContract.document.fileName = `${contract.vehicle.registration}_lease_contract_${contract.contractId}.pdf`;
                    await generatedContract.save();
                    generatedDocuments.push(generatedContract.document);
                } else {
                    this.logger.error({
                        message: 'Could not generate contract document for contract',
                        detail: { contractId: contract.contractId, generatedDocument: generatedContract.generatedDocumentId },
                        fn: this.batchGenerateContractDocuments.name,
                    });
                }
            } catch (error) {
                this.logger.error({
                    message: 'Could not generate contract document for contract',
                    detail: { contractId: contract.contractId, error },
                    fn: this.batchGenerateContractDocuments.name,
                });
            }
        }
        if (generatedDocuments.length < 1) {
            this.logger.error({
                message: 'Did not generate any contract documents',
                fn: this.batchGenerateContractDocuments.name,
            });
            return;
        }

        const zipDocument = await this.createZippedFolderService.createZippedFolder(generatedDocuments, this.directory);

        this.logger.debug({
            message: 'Generated contract documents:',
            detail: { generatedDocuments, zipDocument },
            fn: this.batchGenerateContractDocuments.name,
        });
        return zipDocument;
    }
}
