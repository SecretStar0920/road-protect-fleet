import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { DockerCompose } from '../../helpers/docker-compose.binding';
import { spawnCommand } from '../../helpers/exec';
import * as chalk from 'chalk';
import { pretty } from '../../helpers/pretty';
import { DockerComposeCommand } from '../../abstract-commands/docker-compose.command';
import { isNil } from 'lodash';
import { PROJECT_NAME_OVERRIDES } from './project-name-overrides';

export default class Logs extends DockerComposeCommand {
    static description = 'Start development environment';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        type: flags.string({ char: 't', description: 'Docker compose type', default: 'dev', options: ['dev', 'test', 'debug'] }),
        service: flags.string({ char: 's', required: false, description: 'Docker compose service' }),
        all: flags.boolean({ char: 'a', required: false, description: 'Show all service logs' }),
        tail: flags.integer({ required: false, description: 'Tail length', default: 50 }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Logs);

        const project = flags.project;
        const type: string = flags.type;
        const tail: number = flags.tail;
        const all: boolean = flags.all;
        let service: string = flags.service;
        const config = await this.getProjectConfig();

        const pathString = path.join(config.directory, `devops/docker-compose/${type}`);
        const dockerCompose = new DockerCompose(type, PROJECT_NAME_OVERRIDES[type]);

        // Check for docker-compose file
        await dockerCompose.composeFileExists(pathString);

        let command: string;
        if (isNil(all)) {
            if (!service) {
                service = await this.selectService(dockerCompose, pathString);
            }
            command = dockerCompose.logs(tail, service);
        } else {
            command = dockerCompose.logs(tail);
        }

        await spawnCommand(command, pathString)
            .toPromise()
            .then((result) => {
                this.log(chalk.default.green('Completed successfully'));
            })
            .catch((error) => {
                this.error(`${pretty(error)}`, { exit: false });
            });
    }
}
