import { exec } from 'child_process';
import * as util from 'util';
import * as glob from 'glob';
import { Logger } from '../../shared/services/logger.service';
import * as path from 'path';

export class PdfTK {
    static async merge(inputFolder: string, logger: Logger): Promise<Buffer> {
        try {
            const fileNames = await util.promisify(glob)(`*.pdf`, { cwd: inputFolder });
            const command = util.promisify(exec);
            const { stdout, stderr } = await command(
                `pdftk ${fileNames.map((fileName) => path.join(inputFolder, fileName)).join(' ')} cat output -`,
                { encoding: 'buffer', maxBuffer: 1024 * 1024 * 100 },
            );
            if (stderr) {
                logger.error(JSON.stringify(stderr));
            }
            return stdout as Buffer;
        } catch (e) {
            logger.error(`Failed to merge files in the folder ${inputFolder} with error message ${e.message}`);
            throw e;
        }
    }
}
