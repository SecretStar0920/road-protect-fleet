import { Command } from '@oclif/command';
import * as fs from 'fs-extra';
import * as path from 'path';
import { cli } from 'cli-ux';
import * as crypto from 'crypto';
import { spawnCommand } from '../helpers/exec';
import * as util from 'util';
import * as glob from 'glob';
import * as progress from 'cli-progress';

export interface ProjectConfig {
    directory: string;
}

export abstract class BaseCommand extends Command {
    protected async getProjectConfig(): Promise<ProjectConfig> {
        // Check file exists
        const filePath = path.join(this.config.configDir, 'project.json');
        const exists = await fs.pathExists(filePath);
        if (!exists) {
            await this.writeProjectConfig({}, true);
        }
        cli.action.start(`Getting config (${filePath})...`);
        let config = await fs.readJSON(filePath);
        cli.action.stop();
        return config;
    }

    protected async writeProjectConfig(config: Partial<ProjectConfig>, isDefault: boolean = false) {
        if (isDefault) {
            this.log('No config found, creating an empty config');
        }
        const filePath = path.join(this.config.configDir, 'project.json');
        await fs.ensureFile(filePath);
        cli.action.start(`Saving config (${filePath})...`);
        const savedConfig = await fs.writeJSON(path.join(this.config.configDir, 'project.json'), config);
        cli.action.stop();

        return savedConfig;
    }

    protected async createBranch(name: string) {
        this.log(
            'Creating a branch to safely make the changes, please review git diff and merge with your working branch if you are happy.',
        );
        const branchName = `${name}/${crypto.randomBytes(3).toString('hex')}`;
        await spawnCommand(`git branch ${branchName} && git checkout ${branchName}`).toPromise();
        this.log(`Created branch: ${branchName}`);
    }

    protected async replaceInFiles(baseDir: string, pattern: string, previous: RegExp, updated: string) {
        const files = await util.promisify(glob)(pattern, { cwd: baseDir });
        const simpleBar = new progress.SingleBar({});
        simpleBar.start(files.length, 0);
        for (const filename of files) {
            simpleBar.increment();
            let file = await fs.readFile(path.join(baseDir, filename), 'utf-8');
            file = file.replace(previous, updated);
            await fs.writeFile(path.join(baseDir, filename), file, { encoding: 'utf-8' });
        }
        simpleBar.stop();
    }
}
