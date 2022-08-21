import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { BaseCommand, ProjectConfig } from '../../abstract-commands/base.command';
import { cli } from 'cli-ux';
import * as fs from 'fs-extra';

const languages = ['en', 'he'];

export default class Group extends BaseCommand {
    static description = 'Checks for duplicate translation values and outputs them';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        lang: flags.string({ char: 'l', description: 'Language to check', default: 'en', options: languages }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(Group);
        const config = await this.getProjectConfig();

        await this.createBranch('translation-grouping');

        for (const lang of languages) {
            await this.groupLang(config, lang);
        }
    }

    private async groupLang(config: ProjectConfig, lang: string) {
        const translationPath = path.join(config.directory, `backend/locales/${lang}/translation.json`);
        const frontendPath = path.join(config.directory, `frontend/src`);

        const translationJson = await fs.readJSON(translationPath);
        let nested: any = {};
        cli.action.start(`Nesting keys for language ${lang}`);
        for (const key in translationJson) {
            const value = translationJson[key];
            if (key.includes('#')) {
                const match = /(.+)#(.+)/g.exec(key);
                if (match && match[1] && match[2]) {
                    nested[match[1]] = nested[match[1]] || {};
                    nested[match[1]][match[2]] = value;
                }
            } else {
                // const sub: any = {};
                // sub[key] = value;
                // nested['general'] = { ...nested['general'], ...sub };
                // await this.replaceInFiles(frontendPath, '**/*.{ts,html}', new RegExp(`${key}`, 'g'), `general.${key}`);
                nested[key] = value;
            }
        }
        cli.action.stop();

        // '(\w+)(#)(\w*)'
        cli.action.start('Replacing keys in files');
        // await this.replaceInFiles(frontendPath, '**/*.{ts,html}',  /'([A-Za-z\-_0-9]+)(#)([A-Za-z\-_0-9]*)'/g, `'$1.$3'`);
        cli.action.stop();

        cli.action.start('Writing the translation file');
        await fs.writeJSON(translationPath, nested);
        cli.action.stop();
    }
}
