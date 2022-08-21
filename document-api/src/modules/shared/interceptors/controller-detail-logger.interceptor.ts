import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as chalk from 'chalk';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '../services/logger.service';
import { Config } from '../../../config/config';

@Injectable()
export class ControllerDetailLogger implements NestInterceptor {
    public static functionCounts: {
        [method: string]: {
            count: number;
            totalTime: number;
        };
    } = {};

    constructor(private logger: Logger) {}

    private getDiffSeverity(diff: number) {
        if (diff <= 100) {
            return chalk.bgGreen;
        } else if (diff <= 500 && diff > 100) {
            return chalk.bgYellow;
        } else {
            return chalk.bgRed;
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Date.now();

        return next.handle().pipe(
            tap(() => {
                if (Config.get.logs.interceptor.executionTime) {
                    this.logExecutionTime(startTime, context);
                }
            }),
        );
    }

    private logExecutionTime(start, context: ExecutionContext) {
        const diff = Date.now() - start;
        const functionCount = ControllerDetailLogger.functionCounts[context.getClass().name + '.' + context.getHandler().name] || {
            count: 0,
            totalTime: 0,
        };
        functionCount.count += 1;
        functionCount.totalTime += diff;
        ControllerDetailLogger.functionCounts[context.getClass().name + '.' + context.getHandler().name] = functionCount;

        const message = `time: ${diff}ms, avg: ${Math.round(functionCount.totalTime / functionCount.count)}, count: ${functionCount.count}`;

        this.logger.debug('------', this.getDiffSeverity(diff)(message), `${context.getClass().name}.${context.getHandler().name}`);
    }
}
