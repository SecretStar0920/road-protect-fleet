import { Injectable } from '@nestjs/common';
import { Logger } from '../../shared/services/logger.service';
import { MulterFile } from '../../shared/models/multer-file.model';
import { v4 } from 'uuid';
import * as path from 'path';
import { DirectoryService } from '../../shared/services/directory.service';
import { FileService } from '../../shared/services/file.service';
import { Unoconv } from '../models/unoconv.model';

@Injectable()
export class ConvertService {
    private directory = path.join('storage/convert');

    constructor(private logger: Logger, private directoryService: DirectoryService, private fileService: FileService) {}

    async convert(pdfFiles: MulterFile[], format: string, glob: string): Promise<Buffer> {
        // Create folders
        const folderName = v4;
        const { inputFolder, outputFolder } = await this.directoryService.createInputOutputDirectories(`${this.directory}/${folderName}`);
        this.logger.debug('Generated folders');
        // Store input files
        await this.fileService.storeFiles(pdfFiles, inputFolder, 'docx');
        this.logger.debug('Stored files');
        // Use unoconv
        this.logger.debug('Converting');
        const result = await Unoconv.convert(format, glob, inputFolder);
        this.logger.debug('Converted');
        // Cleanup
        // await this.directoryService.cleanup(`${this.directory}/${folderName}`);
        // Return result
        return result;
    }
}
