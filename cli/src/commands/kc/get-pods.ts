import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import { KubectlCommand } from '../../abstract-commands/kubectl.command';
import { pretty } from '../../helpers/pretty';

export default class GetPods extends KubectlCommand {
    static description = 'Get list of pods';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        context: flags.string({ char: 'c', description: 'Kubectl context to use', options: ['prod', 'staging'] }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(GetPods);

        const context = flags.context;

        // Check version
        await this.checkVersion();

        // Change context
        await this.changeContext(context);

        // Get pods
        const pods = await this.getPods();
        this.log('Pods: ', pretty(pods));
    }
}
