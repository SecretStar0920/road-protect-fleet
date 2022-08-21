import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { DockerCompose } from '../../helpers/docker-compose.binding';
import { spawnCommand } from '../../helpers/exec';
import * as chalk from 'chalk';
import { pretty } from '../../helpers/pretty';
import { DockerComposeCommand } from '../../abstract-commands/docker-compose.command';
import { PROJECT_NAME_OVERRIDES } from './project-name-overrides';

export default class Start extends DockerComposeCommand {
    static description = 'Start development environment';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        type: flags.string({ char: 't', description: 'Docker compose type', default: 'dev', options: ['dev', 'test', 'debug'] }),
        watch: flags.boolean({ char: 'w', description: 'Whether to start in full-watch mode or release', default: false }),
        build: flags.boolean({ char: 'b', description: 'Whether to build or not', default: false }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Start);

        const watch: boolean = flags.watch;
        const type: string = flags.type;
        const config = await this.getProjectConfig();

        const pathString = path.join(config.directory, `devops/docker-compose/${type}`);
        const dockerCompose = new DockerCompose(type, PROJECT_NAME_OVERRIDES[type]);

        // Check for docker-compose file
        await dockerCompose.composeFileExists(pathString);

        await spawnCommand(dockerCompose.up(watch, flags.build), pathString)
            .toPromise()
            .then((result) => {
                this.log(chalk.default.green('Completed successfully'));
            })
            .catch((error) => {
                this.error(`${pretty(error)}`, { exit: false });
            });
    }
}
