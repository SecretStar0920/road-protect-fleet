import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as chalk from 'chalk';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@modules/shared/services/logger.service';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Request } from 'express';
import { get, some } from 'lodash';
import { Config } from '@config/config';

@Injectable()
export class ControllerDetailLogger implements NestInterceptor {
    public static omit: string[] = ['/api/v1/health'];

    public static functionCounts: {
        [method: string]: {
            count: number;
            totalTime: number;
        };
    } = {};

    public static shouldLogExecutionTimes = Config.get.logs.interceptor.executionTime;

    constructor(private logger: Logger) {}

    private getDiffSeverity(diff: number) {
        if (diff <= 100) {
            return chalk.greenBright;
        } else if (diff <= 500 && diff > 100) {
            return chalk.yellowBright;
        } else {
            return chalk.redBright;
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();

        const request: Request & { identity: IdentityDto } = context.switchToHttp().getRequest();
        const identity: IdentityDto = request.identity as IdentityDto;

        // Omit certain routes
        if (some(ControllerDetailLogger.omit, (url) => url === request.url)) {
            return next.handle();
        }

        if (Config.get.logs.interceptor.by) {
            this.logRequester(identity, request);
        }

        return next.handle().pipe(
            tap(() => {
                if (ControllerDetailLogger.shouldLogExecutionTimes) {
                    this.logExecutionTime(startTime, request);
                }
            }),
        );
    }

    private logRequester(identity: IdentityDto, req: Request) {
        if (get(identity, 'user.email', false)) {
            let context = null;
            if (!Config.get.isDevelopment()) {
                context = {
                    userId: identity.user.userId,
                    accountId: identity.accountId,
                    accountUserId: identity.accountUserId,
                    type: identity.user.type,
                    url: req.url,
                    method: req.method,
                };
            }
            this.logger.debug({
                message: `>> [${identity.user.type}] ${chalk.blueBright(
                    `${identity.user.email} (u:${identity.user.userId})(au:${identity.accountUserId})(a:${identity.accountId})`,
                )}`,
                detail: context,
                fn: `(${req.method}) ${req.route.path}`,
            });
        }
    }

    private logExecutionTime(start, req: Request) {
        const diff = Date.now() - start;
        const functionCount = ControllerDetailLogger.functionCounts[req.url] || {
            count: 0,
            totalTime: 0,
        };
        functionCount.count += 1;
        functionCount.totalTime += diff;
        ControllerDetailLogger.functionCounts[req.url] = functionCount;

        const message = `>> time: ${diff}ms, avg: ${Math.round(functionCount.totalTime / functionCount.count)}ms, count: ${
            functionCount.count
        }`;

        this.logger.debug({ message: this.getDiffSeverity(diff)(message), detail: null, fn: `(${req.method}) ${req.route.path}` });
    }
}
