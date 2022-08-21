import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { BaseCommand } from '../../abstract-commands/base.command';
import { executeCommand } from '../../helpers/exec';
import { pretty } from '../../helpers/pretty';

export default class UpdateSubmodules extends BaseCommand {
    static description = 'Update crawler submodules';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const config = await this.getProjectConfig();
        const pathString = path.join(config.directory, 'crawler-api');
        this.log('Git update submodules');
        await executeCommand('git pull --recurse-submodules').catch((error) => {
            this.error(`${pretty(error)}`);
            this.exit(1);
        });
        await executeCommand(`git submodule update --recursive --remote`).catch((error) => {
            this.error(`${pretty(error)}`);
            this.exit(1);
        });

        this.log('Git commit');
        await executeCommand(`git commit -am 'Updated crawler submodule'`).catch((error) => {
            this.error(`${pretty(error)}`);
            this.exit(1);
        });

        this.log('Finished with submodule update. Remember to push.');
    }
}
