import { Injectable } from '@nestjs/common';
import { Logger } from './logger.service';
import * as path from 'path';
import * as util from 'util';
import * as rimraf from 'rimraf';
import * as fs from 'fs-extra';

@Injectable()
export class DirectoryService {
    constructor(private logger: Logger) {}

    async createInputOutputDirectories(directory: string): Promise<{ inputFolder: string; outputFolder: string }> {
        const inputFolder: string = path.join(directory, 'input');
        const outputFolder: string = path.join(directory, 'output');
        await this.createDirectory(inputFolder);
        await this.createDirectory(outputFolder);

        return { inputFolder, outputFolder };
    }

    async createDirectory(directory: string) {
        return await fs.mkdirp(directory);
    }

    async cleanup(directory: string) {
        const rmrf = util.promisify(rimraf);
        return await rmrf(`${directory}`);
    }
}
