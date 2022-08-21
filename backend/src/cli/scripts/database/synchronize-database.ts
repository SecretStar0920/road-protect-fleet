import { Script } from '../script';
import { ScriptDescription } from '../script-description';
import { INestApplication } from '@nestjs/common';
import * as chalk from 'chalk';
import { Config } from '@config/config';
import { getConnection } from 'typeorm';
import { Logger } from '@logger';

export class SyncDatabase extends Script {
    description = new ScriptDescription({
        command: 'database:sync',
        description: 'Syncs the database',
        modifier: (yargs) => {
            return yargs.option('f', {
                alias: 'force',
                boolean: true,
                default: false,
                describe: `Force sync to take place even if it's in production.`,
            });
        },
    });

    async run(app: INestApplication, logger: Logger, args: any = {}): Promise<void> {
        logger.log({ message: chalk.red('Syncing the database'), fn: this.run.name });

        if (Config.get.isProduction() && !args.force) {
            logger.error({
                message: chalk.red(
                    'You are trying to sync a database in a production environment. Use the --force option if this is intentional.',
                ),
                fn: this.run.name,
            });
            process.exit(1);
        }

        const mainConnection = getConnection(Config.get.databases.main.name);
        await mainConnection.synchronize();

        logger.log({ message: chalk.green('Sync complete!'), fn: this.run.name });
    }
}
