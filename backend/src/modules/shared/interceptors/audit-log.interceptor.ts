import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Request } from 'express';
import { AuditLog } from '@entities';
import { Logger } from '@logger';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor() {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request & { identity: IdentityDto } = context.switchToHttp().getRequest();
        const identity: IdentityDto = request.identity as IdentityDto;

        if (!identity) {
            return next.handle();
        }

        if (request.method === 'GET') {
            return next.handle();
        }

        return next.handle().pipe(
            catchError((error) => {
                AuditLog.create({
                    user: identity.user,
                    forAccount: { accountId: identity.accountId },
                    success: false,
                    action: {
                        route: request.route.path,
                        url: request.url,
                        method: request.method,
                        body: omitUnreadable(request.body),
                        response: omitUnreadable(error),
                    },
                })
                    .save()
                    .then()
                    .catch((e) => {
                        Logger.instance.error({ message: 'Failed to log user action', detail: e, fn: 'Audit Log Interceptor' });
                    });
                throw error;
            }),
            tap((res) => {
                // Note, we are storing response and body, probably going to be very inefficient over time and will need cleanup
                AuditLog.create({
                    user: identity.user,
                    forAccount: { accountId: identity.accountId },
                    action: {
                        route: request.route.path,
                        url: request.url,
                        method: request.method,
                        body: omitUnreadable(request.body),
                        response: omitUnreadable(res),
                    },
                })
                    .save()
                    .then()
                    .catch((e) => {
                        Logger.instance.error({ message: 'Failed to log user action', detail: e, fn: 'Audit Log Interceptor' });
                    });
            }),
        );
    }
}
