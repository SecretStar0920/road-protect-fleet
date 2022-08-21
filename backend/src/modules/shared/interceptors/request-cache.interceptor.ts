import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Request } from 'express';
import { Client, RequestCache } from '@entities';
import { Logger } from '@logger';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';

@Injectable()
export class RequestCacheInterceptor implements NestInterceptor {
    constructor() {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request & { identity?: IdentityDto; client?: Client } = context.switchToHttp().getRequest();

        // Custom client check to solve bug where request.client is some sort of socket connection
        const client = request.client instanceof Client ? request.client : null;
        const body = omitUnreadable(request.body);

        return next.handle().pipe(
            catchError((error) => {
                RequestCache.create({
                    requestDetails: {
                        url: request.url,
                        body,
                        identity: request.identity,
                        method: request.method,
                        headers: request.headers,
                        client,
                    } as any,
                    responseDetails: { error },
                })
                    .save()
                    .then()
                    .catch((e) => {
                        Logger.instance.error({
                            message: 'Failed to cache request with error response',
                            detail: e,
                            fn: 'RequestCacheInterceptor',
                        });
                    });
                throw error;
            }),
            tap((response) => {
                // Note, we are storing response and body, probably going to be very inefficient over time and will need cleanup
                RequestCache.create({
                    requestDetails: {
                        url: request.url,
                        body,
                        identity: request.identity,
                        method: request.method,
                        headers: request.headers,
                        client,
                    } as any,
                    responseDetails: { response: omitUnreadable(response) },
                })
                    .save()
                    .then()
                    .catch((e) => {
                        Logger.instance.error({
                            message: 'Failed to cache request with success response',
                            detail: e,
                            fn: 'RequestCacheInterceptor',
                        });
                    });
            }),
        );
    }
}
