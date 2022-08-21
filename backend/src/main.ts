import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from '@logger';
import * as bodyParser from 'body-parser';
import { Config } from '@config/config';
import { ControllerDetailLogger } from '@modules/shared/interceptors/controller-detail-logger.interceptor';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionLoggerFilter } from '@modules/shared/exceptions/http-exception-logger.filter';
import { AuditLogInterceptor } from '@modules/shared/interceptors/audit-log.interceptor';
import { InitialiseSwagger } from './swagger';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { getConnection } from 'typeorm';
import { NormalizrSchemaHelper } from '@modules/shared/normalizr/normalizr-schema-helper';
import helmet = require('helmet');
import { AllExceptionsFilter } from '@modules/shared/exceptions/all-exception-logger.filter';

const logger = Logger.instance;

// I'm adding this to avoid unhandled rejections in a safer way
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// @See https://www.npmjs.com/package/typeorm-transactional-cls-hooked
initializeTransactionalContext(); // Initialize cls-hooked
patchTypeORMRepositoryWithBaseRepository(); // NB

async function bootstrap() {
    logger.log({ message: 'Starting with environment:', detail: Config.get.env, fn: 'bootstrap' });
    const app: INestApplication = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
    });

    app.setGlobalPrefix('api/v1');
    logger.debug({ message: 'API Prefix', detail: 'api/v1', fn: 'bootstrap' });
    // Validation pipe for Dtos
    // @ts-ignore
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    //  Middleware
    app.useGlobalInterceptors(new ControllerDetailLogger(Logger.instance));
    app.useGlobalInterceptors(new AuditLogInterceptor());

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new HttpExceptionLoggerFilter(httpAdapter));
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    // @ts-ignore
    app.use(helmet());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(cookieParser());
    app.use(bodyParser.text({ type: ['application/xml', 'text/plain'] }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    logger.debug({ message: 'Initialised middleware', detail: null, fn: 'bootstrap' });

    // Swagger
    await InitialiseSwagger(app);
    // Normalizr
    const connection = await getConnection();
    await NormalizrSchemaHelper.generateSchemaFromTypeOrmMetadata(connection);

    // Startup
    logger.debug({ message: 'Listening on port', detail: Config.get.port, fn: 'bootstrap' });
    await app.listen(Config.get.port);
}

bootstrap()
    .catch((e) => {
        logger.error({ message: 'Bootstrap failed', detail: e, fn: 'bootstrap' });
        throw e;
    })
    .then((val) => {
        logger.log({ message: 'Bootstrap successful', detail: null, fn: 'bootstrap' });
    });
