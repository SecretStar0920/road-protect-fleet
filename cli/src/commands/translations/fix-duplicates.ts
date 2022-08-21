import { flags } from '@oclif/command';
import { Input } from '@oclif/command/lib/flags';
import * as Parser from '@oclif/parser';
import * as path from 'path';
import { BaseCommand } from '../../abstract-commands/base.command';
import { forEach, invertBy, pickBy, some } from 'lodash';
import * as fs from 'fs-extra';
import { pretty } from '../../helpers/pretty';
import { flatten } from 'flat';

const languages = ['en', 'he'];

export default class FixDuplicates extends BaseCommand {
    static description = 'Checks for duplicate translation values and outputs them';

    static flags: Input<any> = {
        help: flags.help({ char: 'h' }),
        lang: flags.string({ char: 'l', description: 'Language to check', default: 'en', options: languages }),
        branch: flags.boolean({ char: 'b', description: 'Whether to create a safe branch', default: true }),
    };

    static args: Parser.args.IArg[] = [];

    async run() {
        const { args, flags } = this.parse(FixDuplicates);
        const config = await this.getProjectConfig();

        const lang: string = flags.lang;
        const branch: boolean = flags.branch;

        const translationPath = path.join(config.directory, `backend/locales/${lang}/translation.json`);
        const frontendPath = path.join(config.directory, `frontend/src`);

        await this.createBranch('translations');

        const translationJson = await fs.readJSON(translationPath);
        // Flatten NB
        const flattenedTranslationJson: any = flatten(translationJson);
        // Get value with all the keys that have that value
        const groupedDuplicates = pickBy(invertBy(flattenedTranslationJson), (val) => val.length > 1);
        // Get all the duplicate keys
        const duplicateKeys: string[] = [];
        forEach(groupedDuplicates, (value, key) => {
            duplicateKeys.push(...value);
        });
        const duplicateValues = Object.keys(groupedDuplicates);
        const nonDupes = pickBy(translationJson, (value) => !some(duplicateValues, (val) => val === value));

        const newJson = nonDupes;

        this.log(pretty(groupedDuplicates));
        // // For each dupe, ask what key it should be, add it and find and replace
        // this.log(`Found ${duplicateValues.length} duplicate values`);
        // for (const dupe in groupedDuplicates) {
        //     const result = await inquirer.prompt([
        //         {
        //             name: 'key',
        //             type: 'input',
        //             message: `What should the key be for this value: "${dupe}". \n Current keys are: "${groupedDuplicates[dupe].join(', ')}"\n`,
        //         },
        //     ]);
        //     const newKey = result.key;
        //     const oldKeys: string[] = groupedDuplicates[dupe];
        //     await this.replaceInFiles(frontendPath, '**/*.{ts,html}', new RegExp(`${oldKeys.join('|')}`, 'g'), newKey);
        //
        //     if (newJson[result.key]) {
        //         this.warn('Key already exists, overwriting');
        //     }
        //     newJson[result.key] = dupe;
        //     await fs.writeJSON(translationPath, newJson);
        // }

        // Sync dupes for other language
    }
}
