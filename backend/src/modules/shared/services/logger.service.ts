import { Config } from '@config/config';
import { Injectable } from '@nestjs/common';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as moment from 'moment';
import * as winston from 'winston';
import * as purdy from 'purdy';
import { inspect } from 'util';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { get, isObject } from 'lodash';
import { EncryptionHelper } from '@modules/shared/helpers/encryption.helper';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';

//////////////////////////////////////////////////
/////////// DECORATOR FUNCTIONS //////////////////
//////////////////////////////////////////////////

export function LoggerClass(options: { label?: string } = {}): ClassDecorator {
    return (target) => {
        target.prototype.classLabel = options.label || target.name;
    };
}

export function LoggerMethod(options: { label?: string; logData?: boolean; async?: boolean } = {}): MethodDecorator {
    let label = options.label;
    const logData = options.logData === undefined ? true : options.logData;
    const async = options.async === undefined ? true : options.async;
    // tslint:disable-next-line:only-arrow-functions
    return function (target: any, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
        // get original method
        const originalMethod = propertyDescriptor.value;
        label = label || propertyKey;

        // redefine descriptor value within own function block
        if (async) {
            propertyDescriptor.value = async function (...args: any[]) {
                const context = this;
                const classLabel = context.classLabel;
                // Set the function label
                context.functionLabel = label;
                const fn = `${classLabel}.${label}`;
                // log arguments before original function
                Logger.instance.log({ message: `Starting`, fn, detail: logData ? args : null });
                // attach original method implementation
                let result: any;
                try {
                    result = await originalMethod.apply(context, args);
                } catch (e) {
                    Logger.instance.warn({ message: `Failed`, fn, detail: logData ? e : null });
                    throw e;
                }
                // log result of method
                Logger.instance.log({ message: `Finished`, fn, detail: logData ? result : null });
                return result;
            };
        } else {
            propertyDescriptor.value = function (...args: any[]) {
                const context = this;
                const classLabel = context.classLabel;
                // Set the function label
                context.functionLabel = label;
                const fn = `${classLabel}.${label}`;
                // log arguments before original function
                Logger.instance.log({ message: `Starting`, fn, detail: logData ? args : null });
                // attach original method implementation
                let result: any;
                try {
                    result = originalMethod.apply(context, args);
                } catch (e) {
                    Logger.instance.warn({ message: `Failed`, fn, detail: logData ? e : null });
                    throw e;
                }
                // log result of method
                Logger.instance.log({ message: `Finished`, fn, detail: logData ? result : null });
                return result;
            };
        }
    };
}

//////////////////////////////////////////////////
/////////// Logger              //////////////////
//////////////////////////////////////////////////

export interface ILog {
    fn: string;
    message: string;
    detail?: any;
    encrypt?: boolean;
}

export interface ILogV2 {
    context: any;
    message: string;
    detail?: any;
}

@Injectable()
export class Logger {
    private readonly logger: winston.Logger;

    private readonly MAX_DEPTH = 8;

    private static _instance: Logger;
    static get instance(): Logger {
        return this._instance || (this._instance = new Logger());
    }

    private constructor() {
        this.createLogFileDirectory();
        const consoleFormat = this.configureConsoleTransport();

        const transports: any[] = [
            Object.assign(
                new winston.transports.File({
                    format: consoleFormat,
                    level: 'error',
                    handleExceptions: true,
                    filename: '/tmp/errors.log',
                }),
                // https://github.com/winstonjs/winston/issues/1673
                {
                    handleRejections: true,
                },
            ),
        ];

        if (Config.get.isDevelopment() || Config.get.isTesting() || Config.get.isDebug()) {
            transports.push(
                new winston.transports.Console({
                    format: consoleFormat,
                    stderrLevels: ['error'],
                    consoleWarnLevels: ['warn', 'warning'],
                }),
            );
        } else if (Config.get.isProduction() || Config.get.isStaging()) {
            transports.push(
                new winston.transports.Console({
                    format: consoleFormat,
                    stderrLevels: ['error'],
                    consoleWarnLevels: ['warn', 'warning'],
                }),
            );
        }

        let level = 'debug';
        if (Config.get.isTesting()) {
            level = 'warn';
        }
        transports.forEach((transport) => transport.on('error', (err) => console.error(`A logging error has taken place`, err)));
        this.logger = winston.createLogger({
            level,
            format: winston.format.json(),
            transports,
            exitOnError: false,
        });
        this.logger.on('error', (err) => console.error('Winston logger error', err));
    }

    private configureConsoleTransport() {
        const consoleFormat = winston.format.printf((info) => {
            const timestamp = chalk.gray(moment(info.timestamp).format('DD/MM HH:mm:ss'));
            let level = '';
            if (info.level === 'info') {
                level = chalk.blue(info.level);
            } else if (info.level === 'error') {
                level = chalk.red(info.level);
            } else if (info.level === 'warn') {
                level = chalk.yellow(info.level);
            } else if (info.level === 'debug') {
                level = chalk.gray(info.level);
            } else {
                level = chalk.blue(info.level);
            }
            const message = info.message;
            let details: any;
            if (typeof info.details === 'string') {
                details = info.details ? info.details : '';
            } else if (typeof info.details === 'object') {
                try {
                    if (Config.get.isDevelopment() || Config.get.isTesting()) {
                        info.details = omitUnreadable(info.details);
                        details = info.details ? '\n' + purdy.stringify(info.details, { indent: 2, depth: 10 }) : '';
                    } else {
                        details = info.details
                            ? ' ' + inspect(info.details, { breakLength: Infinity, compact: true, depth: Config.get.logs.depth })
                            : '';
                    }
                } catch (e) {
                    details = '[unable to stringify this context as it was circular or invalid]';
                }
            } else {
                details = info.details != null ? info.details : '';
            }
            return `${timestamp} ${level} ${message} ${details}`;
        });
        return consoleFormat;
    }

    private createLogFileDirectory() {
        if (!fs.existsSync(Config.get.storageDirectory())) {
            try {
                fs.mkdirSync(Config.get.storageDirectory());
            } catch (e) {
                console.error('Could not create log storage directory', e.code);
            }
        }
    }

    private getFn(context: any) {
        const classLabel = get(context, 'classLabel', undefined);
        const functionLabel = get(context, 'functionLabel', undefined);
        if (!classLabel || !functionLabel) {
            this.warn({ message: 'Missing logging decorators', fn: 'Logger.getFn' });
            return '';
        }
        return `${classLabel}.${functionLabel}`;
    }

    private mapLog(log: ILog, level: string) {
        return {
            timestamp: moment().toISOString(),
            level,
            functionName: log.fn,
            message: `${chalk.magenta(chalk.italic(`${log.fn}`))} ${log.message}`,
            details: log.encrypt ? EncryptionHelper.encryptJSON(this.removeExceptions(log.detail)) : this.removeExceptions(log.detail),
        };
    }

    private removeExceptions(detail: any, map = new Map<any, boolean>(), depth = 0) {
        if (depth > this.MAX_DEPTH) {
            return `[Reached maximum depth of ${this.MAX_DEPTH}...]`;
        }
        try {
            if (detail instanceof Error) {
                return {
                    message: detail.message,
                    stack: detail.stack,
                };
            }
            if (!isObject(detail)) {
                return detail;
            }

            if (map.get(detail)) {
                return '[circular]';
            } else {
                map.set(detail, true);
            }

            const keys = Object.keys(detail).filter((key) => detail.hasOwnProperty(key));
            const result: any = {};
            const nextDepth = depth + 1;
            for (const key of keys) {
                result[key] = this.removeExceptions(detail[key], map, nextDepth);
            }
            return result;
        } catch (e) {
            return detail;
        }
    }

    private mapLogV2(log: ILogV2, level: string) {
        const functionName = this.getFn(log.context);
        return {
            timestamp: moment().toISOString(),
            level,
            functionName,
            message: `${chalk.magenta(chalk.italic(`${functionName}`))} ${log.message}`,
            details: log.detail,
        };
    }

    debug(log: ILog) {
        this.logger.debug(this.mapLog(log, 'debug'));
    }

    debugV2(log: ILogV2) {
        this.logger.debug(this.mapLogV2(log, 'debug'));
    }

    log(log: ILog) {
        this.logger.info(this.mapLog(log, 'info'));
    }

    logV2(log: ILogV2) {
        this.logger.info(this.mapLogV2(log, 'info'));
    }

    error(log: ILog) {
        this.logger.error(this.mapLog(log, 'error'));
    }

    errorV2(log: ILogV2) {
        this.logger.error(this.mapLogV2(log, 'error'));
    }

    warn(log: ILog) {
        this.logger.warn(this.mapLog(log, 'warn'));
    }

    warnV2(log: ILogV2) {
        this.logger.warn(this.mapLogV2(log, 'warn'));
    }
}
