import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from '@logger';

@Catch()
// I'm not sure if this is applicable but I can't see certain exceptions in the
// logs and I'd like to add this to see if I do.
// TODO: Remove this if it's not applicable
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        if (exception instanceof HttpException) {
            // We know we already log these
            return super.catch(exception, host);
        }

        Logger.instance.error({
            message: exception?.message ? exception?.message : `An exception has occurred that IS NOT an HTTP error.`,
            detail: {
                message: exception?.message,
                exception,
            },
            fn: AllExceptionsFilter.name,
        });

        super.catch(exception, host);
    }
}
