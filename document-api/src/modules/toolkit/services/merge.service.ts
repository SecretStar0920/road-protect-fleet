import { Injectable } from '@nestjs/common';
import { Logger } from '../../shared/services/logger.service';
import { MulterFile } from '../../shared/models/multer-file.model';
import { v4 } from 'uuid';
import * as path from 'path';
import { PdfTK } from '../models/pdftk.model';
import { DirectoryService } from '../../shared/services/directory.service';
import { FileService } from '../../shared/services/file.service';

@Injectable()
export class MergeService {
    private directory = path.resolve('./storage/merge');

    constructor(private logger: Logger, private directoryService: DirectoryService, private fileService: FileService) {}

    async merge(pdfFiles: MulterFile[]): Promise<Buffer> {
        this.logger.debug(`Merging ${pdfFiles.length} files`);
        // Create folders
        try {
            const folderName = v4();
            const { inputFolder, outputFolder } = await this.directoryService.createInputOutputDirectories(
                `${this.directory}/${folderName}`,
            );

            this.logger.debug('Created folders', { inputFolder, outputFolder });

            // Store input files
            await this.fileService.storeFiles(pdfFiles, inputFolder, 'pdf');
            this.logger.debug('Stored input files', { inputFolder });
            // Use pdf toolkit
            const result = await this.mergeFiles(inputFolder);
            this.logger.debug('Merged PDFs', { inputFolder });
            // // Cleanup
            await this.directoryService.cleanup(`${this.directory}/${folderName}`);
            this.logger.debug('Cleaned up Directory', { inputFolder });
            // Return result
            return result;
        } catch (e) {
            this.logger.error(`Failed to merge document ${e.message}`);
            throw e;
        }
    }

    private async mergeFiles(inputFolder: string): Promise<Buffer> {
        try {
            return await PdfTK.merge(inputFolder, this.logger);
        } catch (e) {
            this.logger.error(`Failed to run pdftk ${e.message}`);
            throw e;
        }
    }
}
