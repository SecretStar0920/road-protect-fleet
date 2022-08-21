import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { DockerCompose } from '../../helpers/docker-compose.binding';
import { spawnCommand, spawnInteractiveCommand } from '../../helpers/exec';
import { DockerComposeCommand } from '../../abstract-commands/docker-compose.command';
import { PROJECT_NAME_OVERRIDES } from './project-name-overrides';

export default class Exec extends DockerComposeCommand {
    static description = 'Start development environment';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        type: flags.string({ char: 't', description: 'Docker compose type', default: 'dev', options: ['dev', 'test', 'debug'] }),
        service: flags.string({ char: 's', required: false, description: 'Docker compose service' }),
        interactive: flags.boolean({ char: 'i', required: false, description: 'Interactive mode', default: false }),
        command: flags.string({ char: 'c', required: false, description: 'The command to run', default: 'bash' }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Exec);

        const project = flags.project;
        const type: string = flags.type;
        let service: string = flags.service;
        let interactive: boolean = flags.interactive;
        let baseCommand: string = flags.command;
        const config = await this.getProjectConfig();

        console.log(flags);

        const pathString = path.join(config.directory, `devops/docker-compose/${type}`);
        const dockerCompose = new DockerCompose(type, PROJECT_NAME_OVERRIDES[type]);

        // Check for docker-compose file
        await dockerCompose.composeFileExists(pathString);

        if (!service) {
            service = await this.selectService(dockerCompose, pathString);
        }

        let command: string;
        if (interactive) {
            command = dockerCompose.execTty(service, baseCommand);
            await spawnInteractiveCommand(command, pathString);
        } else {
            command = dockerCompose.execTty(service, baseCommand);
            await spawnCommand(command, pathString).toPromise();
        }
    }
}
