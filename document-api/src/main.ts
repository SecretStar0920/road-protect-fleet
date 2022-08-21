import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from './modules/shared/services/logger.service';
import { ControllerDetailLogger } from './modules/shared/interceptors/controller-detail-logger.interceptor';
import { Config } from './config/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './modules/shared/exceptions/all-exception-logger.filter';
import { HttpExceptionLoggerFilter } from './modules/shared/exceptions/http-exception-logger.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new ControllerDetailLogger(Logger.instance));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new HttpExceptionLoggerFilter(httpAdapter));
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );
    Logger.instance.log(`Listening on port ${Config.get.port}`);
    await app.listen(Config.get.port);
}

bootstrap()
    .catch((e) => {
        Logger.instance.error('Bootstrap failed', e, 'bootstrap');
        throw e;
    })
    .then((val) => {
        Logger.instance.log('Bootstrap successful', null, 'bootstrap');
    });
