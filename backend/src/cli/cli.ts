import * as appRootPath from 'app-root-path';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { MigrateDatabase } from './scripts/database/migrate-database';
import { SeedDatabase } from './scripts/database/seed-database';
import { Script } from './scripts/script';
import { Logger } from '@logger';
import { NestFactory } from '@nestjs/core';
import * as yargs from 'yargs';
import { AppModule } from '../app.module';
import { DropDatabase } from './scripts/database/drop-database';
import { SyncDatabase } from './scripts/database/synchronize-database';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';

dotenv.config({ path: path.join(appRootPath.path, '.env') });
initializeTransactionalContext(); // Initialize cls-hooked

export class Cli {
    static cliUsage: string = 'cli <cmd> [args]';

    static registered: Script[] = [new MigrateDatabase(), new SeedDatabase(), new DropDatabase(), new SyncDatabase()];

    static async run() {
        const sortedScripts = Cli.sortRegisteredScripts();
        yargs.usage(Cli.cliUsage).scriptName('');
        sortedScripts.forEach((script) => {
            yargs.command(script.description.command, script.description.description, script.description.modifier, (args) => {
                Cli._run(script, args);
            });
        });
        yargs.showHelpOnFail(true).help().demandCommand().recommendCommands().argv;
    }

    private static async _run(script: Script, args: any) {
        const logger = Logger.instance;
        try {
            const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
            await script.run(app, logger, args);
            process.exit(0);
        } catch (e) {
            logger.error({ message: 'Cli command failed', detail: e, fn: this._run.name });
            process.exit(1);
        }
    }

    private static sortRegisteredScripts(): Script[] {
        return Cli.registered.sort((a, b) => {
            const aCommand = a.description.getCommandOnly();
            const bCommand = b.description.getCommandOnly();
            if (aCommand === bCommand) {
                return 0;
            }
            return aCommand < bCommand ? -1 : 1;
        });
    }
}

Cli.run().catch((e) => console.error(e));
