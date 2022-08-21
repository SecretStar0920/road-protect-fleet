import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from '@modules/document/controllers/document.controller';
import { Logger } from '@logger';
import { Document } from '@entities';
import * as moment from 'moment';
import { Config } from '@config/config';
import * as JSZip from 'jszip';
import * as fs from 'fs-extra';
import * as path from 'path';
import { CreateDocumentService } from '@modules/document/services/create-document.service';

@Injectable()
export class CreateZippedFolderService {
    constructor(private logger: Logger, private createDocumentService: CreateDocumentService) {}

    async createZippedFolder(generatedDocuments: Document[], directoryName: string): Promise<Document> {
        const zippedFilename = directoryName + '-' + moment().toISOString() + '.zip';
        const zippedPath = Config.get.storageDirectory() + '/' + directoryName + '/' + zippedFilename;
        this.logger.debug({
            message: 'Zipping documents into:',
            detail: zippedFilename,
            fn: this.createZippedFolder.name,
        });
        // Returns a zipped folder of generated documents
        const zip = new JSZip();

        // Generate a directory within the zip file structure
        const folder = zip.folder(directoryName);

        // Add files to the directory
        for (const document of generatedDocuments) {
            const documentFile = await fs.readFile(Config.get.storageDirectory(path.join(document.fileDirectory, document.storageName)));
            folder.file(document.fileName, documentFile, { base64: true });
        }

        // Generate the zip file asynchronously
        let file;
        zip.generateAsync({ type: 'nodebuffer' }).then(async (content) => {
            file = await fs.writeFile(zippedPath, content);
        });

        const dto: CreateDocumentDto = {
            storageName: zippedFilename,
            fileName: directoryName + '.zip',
            fileDirectory: directoryName,
        };
        const zipDocument = await this.createDocumentService.createOnly(dto);
        return await zipDocument.save();
    }
}
