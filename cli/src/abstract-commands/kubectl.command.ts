import cli from 'cli-ux';
import { executeCommand } from '../helpers/exec';
import { Kubectl } from '../helpers/kubectl.binding';
import { isNil } from 'lodash';
import * as inquirer from 'inquirer';
import { tableToKeyedJson } from '../helpers/table-to-json';
import { BaseCommand } from './base.command';

export abstract class KubectlCommand extends BaseCommand {
    protected async changeContext(context: string) {
        if (isNil(context)) {
            const contexts = await executeCommand(Kubectl.getContexts());
            const contextsJson = tableToKeyedJson(contexts.out, 'NAME');
            const responses = await inquirer.prompt([
                {
                    name: 'context',
                    message: 'Select a context',
                    type: 'list',
                    choices: Object.keys(contextsJson).map((p) => {
                        return { name: p };
                    }),
                },
            ]);
            context = responses.context;
        }

        cli.action.start('Checking context...');
        await executeCommand(Kubectl.useContext(context));
        cli.action.stop();
    }

    protected async getPods() {
        cli.action.start('Getting pods...');
        const pods = await executeCommand(Kubectl.getPods());
        cli.action.stop();
        return tableToKeyedJson(pods.out, 'NAME');
    }

    protected async checkVersion() {
        cli.action.start('Checking version...');
        const version = await executeCommand(Kubectl.checkVersion()).catch((error) => {
            this.error(error);
            this.exit(1);
        });
        if (version.error) {
            this.error(version.error);
            this.exit(1);
        }
        const versionMatch = /GitVersion:"(v1.16.3)"/.exec(version.out) || [null, 'Unknown'];
        if (versionMatch.length >= 2) {
            this.log('Version: ', versionMatch[1]);
        }
        cli.action.stop();
    }

    protected async selectPod(): Promise<string> {
        const pods = await this.getPods();
        const podNames = Object.keys(pods);

        const responses = await inquirer.prompt([
            {
                name: 'pod',
                message: 'Select a pod',
                type: 'list',
                choices: podNames.map((p) => {
                    return { name: p };
                }),
            },
        ]);
        return responses.pod;
    }
}
