import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from '../services/logger.service';

@Catch(HttpException)
export class HttpExceptionLoggerFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const token = request.headers.authorization;

        Logger.instance.error(
            `[${status}] (${request.method}) ${request.url}`,
            {
                status,
                url: `[${request.method}] ${request.url}`,
                exception,
                // token,
            },
            HttpExceptionLoggerFilter.name,
        );

        // Let standard base exception filter handle
        super.catch(exception, host);
    }
}
