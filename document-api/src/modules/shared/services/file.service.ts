import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from './logger.service';
import { MulterFile } from '../models/multer-file.model';
import * as fs from 'fs-extra';
import { ERROR_CODES } from '../errors/error-codes.const';

@Injectable()
export class FileService {
    constructor(private logger: Logger) {}

    async storeFiles(pdfFiles: MulterFile[], folderName: string, extension: string) {
        for (let i = 0; i < pdfFiles.length; i++) {
            const file = pdfFiles[i];
            try {
                await fs.writeFile(`${folderName}/${i}.${extension}`, file.buffer);
                this.logger.debug(`Created file with name ${folderName}/${i}.${extension}`);
            } catch (e) {
                this.logger.error(`Failed to write file ${file.originalname}`, e);
                // TODO: Modify the deployments to share the error codes across the project
                throw new BadRequestException(ERROR_CODES.E013_CouldNotMergeFile.message({ fileName: file.originalname }));
            }
        }
    }
}
