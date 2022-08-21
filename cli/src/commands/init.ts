import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { BaseCommand } from '../abstract-commands/base.command';
import { merge } from 'lodash';

export default class Init extends BaseCommand {
    static description = 'Initialise the CLI for your project directory [ Required ]';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Init);
        const config = await this.getProjectConfig();
        const pwd = path.resolve('.');
        this.log('Setting project directory: ', pwd);
        const newConfig = merge(config, { directory: pwd });
        await this.writeProjectConfig(newConfig);
        this.log('Config: ', newConfig);
    }
}
