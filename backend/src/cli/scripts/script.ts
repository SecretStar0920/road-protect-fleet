import { ScriptDescription } from './script-description';
import { Logger } from '@logger';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';

export abstract class Script {
    description: ScriptDescription;

    async init(): Promise<INestApplication> {
        // Wait for the app to start up so that we know TypeOrm is sorted
        const app = await NestFactory.create(AppModule, {
            logger: Logger.instance,
        });

        return app;
    }

    async execute(args: any = {}): Promise<void> {
        const app = await this.init();
        const logger = Logger.instance;
        await this.run(app, logger, args);
        process.exit(0);
    }

    abstract async run(app: INestApplication, logger: Logger, args: any): Promise<void>;
}
