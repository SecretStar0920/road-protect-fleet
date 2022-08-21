import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import { KubectlCommand } from '../../abstract-commands/kubectl.command';
import { executeCommand } from '../../helpers/exec';
import { Kubectl } from '../../helpers/kubectl.binding';

export default class DescribePod extends KubectlCommand {
    static description = 'Describe a pod';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        context: flags.string({ char: 'c', description: 'Kubectl context to use', options: ['prod', 'staging'] }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(DescribePod);

        const context = flags.context;

        // Check version
        await this.checkVersion();

        // Change context
        await this.changeContext(context);

        // Get pods
        const pod = await this.selectPod();

        const descriptions = await executeCommand(Kubectl.describePod(pod));
        this.log(descriptions.out);
    }
}
