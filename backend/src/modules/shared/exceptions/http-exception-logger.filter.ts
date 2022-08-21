import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { Logger } from '@logger';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionLoggerFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const token = request.headers.authorization;

        Logger.instance.error({
            message: `[${status}] (${request.method}) ${request.url}`,
            detail: {
                status,
                url: `[${request.method}] ${request.url}`,
                exception,
                // token,
            },
            fn: HttpExceptionLoggerFilter.name,
        });

        // Let standard base exception filter handle
        super.catch(exception, host);
    }
}
