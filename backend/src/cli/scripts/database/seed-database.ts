import { Script } from '../script';
import { ScriptDescription } from '../script-description';
import { INestApplication } from '@nestjs/common';
import { SeederService } from '@seeder/seeder.service';
import * as chalk from 'chalk';
import { Logger } from '@logger';

export class SeedDatabase extends Script {
    description = new ScriptDescription({
        command: 'database:seed',
        description: 'Seeds the database based on the seeders registered in the SeederService.',
        modifier: (yargs) => {
            return yargs;
        },
    });

    async run(app: INestApplication, logger: Logger, args: any = {}): Promise<void> {
        logger.log({ message: chalk.red('Seeding the database'), fn: this.run.name });

        const seederService = app.get(SeederService);
        await seederService.seed();

        logger.log({ message: chalk.green('Seeding complete!'), fn: this.run.name });
    }
}
