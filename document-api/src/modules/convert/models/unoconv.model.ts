import { exec } from 'child_process';
import * as util from 'util';

export class Unoconv {
    static async convert(format: string = 'pdf', glob: string, inputFolder: string): Promise<Buffer> {
        const command = util.promisify(exec);
        const { stdout, stderr } = await command(
            `cd ${inputFolder} &&\
                    unoconv -f ${format} --stdout\
                    ./${glob}`,
            { encoding: 'buffer', maxBuffer: 1024 * 1000 * 1000 },
        );
        return stdout;
    }
}
