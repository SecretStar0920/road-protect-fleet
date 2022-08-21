import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import { Kubectl } from '../../helpers/kubectl.binding';
import { spawnCommand } from '../../helpers/exec';
import { KubectlCommand } from '../../abstract-commands/kubectl.command';

export default class Logs extends KubectlCommand {
    static description = 'Display logs for a selected pod';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        context: flags.string({ char: 'c', description: 'Kubectl context to use', options: ['prod', 'staging'] }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Logs);

        const context = flags.context;

        // Check version
        await this.checkVersion();

        // Change context
        await this.changeContext(context);

        // Get pods
        const pod = await this.selectPod();

        await spawnCommand(Kubectl.getLogs(pod, 50)).pipe().toPromise();

        this.log('Finished');
    }
}
