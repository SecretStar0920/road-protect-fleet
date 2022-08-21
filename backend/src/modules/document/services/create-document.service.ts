import { Injectable } from '@nestjs/common';
import { CreateDocumentDto, CreateDocumentsDto } from '@modules/document/controllers/document.controller';
import { Logger } from '@logger';
import { Document } from '@entities';
import * as fs from 'fs-extra';
import { Config } from '@config/config';
import { isNil } from 'lodash';
import { v4 } from 'uuid';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FileNameMissingException } from '@modules/document/exceptions/file-name-missing.exception';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { ContractOcrIntegration } from '@integrations/contract/contract-ocr.integration';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class CreateDocumentService {
    constructor(private logger: Logger, private contractOcrService: ContractOcrIntegration, private antivirusService: AntivirusService) {}

    async create(dto: CreateDocumentDto): Promise<Document> {
        const createdDocument = await this.createOnly(dto);
        return createdDocument.save();
    }

    async createOnly(dto: CreateDocumentDto): Promise<Document> {
        this.logger.debug({ message: 'Creating Document', detail: dto, fn: this.create.name });
        if (isNil(dto.storageName)) {
            dto.storageName = v4() + dto.fileName.replace('/', '');
        }
        const document = await Document.create(dto);
        this.logger.debug({ message: 'Created Document', detail: document, fn: this.create.name });
        return document;
    }

    async createDirectory(directory) {
        return fs.mkdirp(directory);
    }

    async saveDocumentFile(file, filename, directory): Promise<void> {
        await this.antivirusService.scanBuffer(Buffer.isBuffer(file) ? file : file.buffer);
        // Create directory
        await this.createDirectory(Config.get.storageDirectory(`${directory}`));
        // Save file
        await fs.writeFile(Config.get.storageDirectory(`${directory}/${filename}`), file);
    }

    @Transactional()
    async saveDocumentFileAndCreate(dto: CreateDocumentDto, file): Promise<Document> {
        // dto.fileName = dto.fileName ? dto.fileName : file.originalname;
        // At this point, the file is just the buffer so it doesn't have the
        // originalname. So I'm going to throw an exception if the name is not
        // defined and we'll find these errors and correct them when we see
        // them pop up.
        if (!dto.fileName) {
            throw new FileNameMissingException(ERROR_CODES.E122_CrateDocumentDtoMissingFilename.message({ dto: JSON.stringify(dto) }));
        }

        dto.fileDirectory = dto.fileDirectory ? dto.fileDirectory : 'documents';
        let document = await this.createOnly(dto);
        document = await document.save();
        await this.saveDocumentFile(file, dto.storageName, dto.fileDirectory);
        return document;
    }

    @Transactional()
    async saveDocumentFileOcrAndCreate(dto: CreateDocumentDto, file: MulterFile, ocr: boolean): Promise<Document> {
        if (!dto.fileName) {
            throw new FileNameMissingException(ERROR_CODES.E122_CrateDocumentDtoMissingFilename.message({ dto: JSON.stringify(dto) }));
        }

        if (ocr) {
            const ocrResults = await this.contractOcrService.retrieveContractOCR(file);
            if (ocrResults) {
                dto.ocr = ocrResults;
            }
        }
        dto.fileDirectory = dto.fileDirectory ? dto.fileDirectory : 'documents';
        let document = await this.createOnly(dto);
        document = await document.save();
        await this.saveDocumentFile(file.buffer, dto.storageName, dto.fileDirectory);
        return document;
    }

    @Transactional()
    async saveDocumentsFileOcrAndCreate(dto: CreateDocumentsDto, files: MulterFile[], ocr: boolean): Promise<Document[]> {
        if (dto.documents.length !== files.length) {
            throw new FileNameMissingException(ERROR_CODES.E122_CrateDocumentDtoMissingFilename.message({ dto: JSON.stringify(dto) }));
        }

        let promises = []
        for (let i = 0; i < dto.documents.length; i++) {
            const createPromise = this.saveDocumentFileOcrAndCreate(dto.documents[i], files[i], ocr)
            promises.push(createPromise)
        }

        return Promise.all(promises)
    }
}
