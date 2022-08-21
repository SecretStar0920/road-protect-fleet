import { Script } from '../script';
import { ScriptDescription } from '../script-description';
import { Config } from '@config/config';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import * as chalk from 'chalk';
import { Logger } from '@logger';

export class MigrateDatabase extends Script {
    description = new ScriptDescription({
        command: 'database:migrate',
        description: 'Runs all TypeOrm migrations.',
        modifier: (yargs) => {
            return yargs.option('f', {
                alias: 'force',
                boolean: true,
                default: false,
                describe: `Force migration to take place even if it's in production.`,
            });
        },
    });

    async run(app: INestApplication, logger: Logger, args: any = {}): Promise<void> {
        logger.log({ message: chalk.red('Migrating the database, this is a DESTRUCTIVE operation!'), fn: this.run.name });

        if (Config.get.isProduction() && !args.force) {
            logger.error({
                message: chalk.red(
                    'You are trying to migrate a database in a production environment. Use the --force option if this is intentional.',
                ),
                fn: this.run.name,
            });
            process.exit(1);
        }

        // Migrate the current database
        const mainConnection = getConnection(Config.get.databases.main.name);

        const hasMigrations = await mainConnection.showMigrations();
        if (!hasMigrations) {
            logger.log({ message: 'No migrations to run', fn: this.run.name });
            process.exit(0);
        }

        try {
            const migrations = await mainConnection.runMigrations({ transaction: 'all' });
            logger.log({ message: chalk.green('Migration complete'), detail: migrations, fn: this.run.name });
        } catch (e) {
            logger.error({ message: chalk.red('Failed to migrate database'), detail: e, fn: this.run.name });
            process.exit(1);
        }
    }
}
