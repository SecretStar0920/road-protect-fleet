import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as repl from 'repl';
import * as Logger from 'purdy';
import { AppModule } from './app.module';
import * as awaitOutside from 'await-outside';
import * as entities from './modules/shared/entities/entities';
import * as _ from 'lodash';

const LOGGER_OPTIONS = {
    indent: 2,
    depth: 10,
};

class InteractiveNestJS {
    async run() {
        // create the application context
        const applicationContext = await NestFactory.createApplicationContext(AppModule);
        // start node repl
        const server = repl.start({
            useColors: true,
            prompt: '> ',
            writer: replWriter,
            ignoreUndefined: true,
        });
        server.context.app = applicationContext;
        server.context.lodash = _;
        server.context.e = entities;
        awaitOutside.addAwaitOutsideToReplServer(server);
    }
}

function replWriter(value: object): string {
    return Logger.stringify(value, LOGGER_OPTIONS);
}

const identity = new InteractiveNestJS();
identity.run();
