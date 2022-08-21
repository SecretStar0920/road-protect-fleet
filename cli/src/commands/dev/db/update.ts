import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { DockerCompose } from '../../../helpers/docker-compose.binding';
import { executeCommand } from '../../../helpers/exec';
import * as chalk from 'chalk';
import { DockerComposeCommand } from '../../../abstract-commands/docker-compose.command';
import { Typeorm } from '../../../helpers/typeorm.binding';
import * as inquirer from 'inquirer';
import { cli } from 'cli-ux';

export default class Update extends DockerComposeCommand {
    static description = 'Update database and generate migrations';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        type: flags.string({ char: 't', description: 'Docker compose type', default: 'dev', options: ['dev', 'testing'] }),
        watch: flags.boolean({ char: 'w', description: 'Whether to start in full-watch mode or release', default: false }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Update);

        const watch: boolean = flags.watch;
        const type: string = flags.type;
        const config = await this.getProjectConfig();
        let service: string = 'backend';

        const pathString = path.join(config.directory, `devops/docker-compose/${type}`);
        const dockerCompose = new DockerCompose(type);

        // Check for docker-compose file
        await dockerCompose.composeFileExists(pathString);

        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the migration?',
            },
        ]);

        const generateCommand = dockerCompose.exec(service, Typeorm.generateMigrations(name));
        const runCommand = dockerCompose.exec(service, Typeorm.runMigrations());

        const migrationResult = await executeCommand(generateCommand, pathString);
        this.log('Migration result', migrationResult.out);

        const runResult = await executeCommand(runCommand, pathString);
        this.log('Run Migration result', runResult.out);

        // Chown
        cli.action.start('Changing ownership of the migration');
        const result = await executeCommand(
            'sudo chown -R $USER .',
            path.join(config.directory, 'backend/src/modules/shared/modules/database/migrations'),
        );
        cli.action.stop();
        if (result.error) {
            this.log(
                `Failed to change ownership, please run ${chalk.default.blue(
                    'sudo chown -R $USER .',
                )} in the migrations directory manually`,
            );
            this.error(result.error);
        }
    }
}
