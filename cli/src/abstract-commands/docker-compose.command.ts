import { BaseCommand } from './base.command';
import { DockerCompose } from '../helpers/docker-compose.binding';
import * as inquirer from 'inquirer';
import { executeCommand } from '../helpers/exec';
import { cli } from 'cli-ux';

export abstract class DockerComposeCommand extends BaseCommand {
    protected async selectService(dockerCompose: DockerCompose, pathString: string) {
        const services = await this.getServices(dockerCompose, pathString);
        const responses = await inquirer.prompt([
            {
                name: 'service',
                message: 'Select a service',
                type: 'list',
                choices: services.map((s) => {
                    return { name: s };
                }),
            },
        ]);
        return responses.service;
    }

    private async getServices(dockerCompose: DockerCompose, pathString: string) {
        cli.action.start('Getting services...');
        const result = await executeCommand(dockerCompose.getServices(), pathString);
        const services = result.out.split('\n');
        cli.action.stop();
        return services;
    }
}
