import { Injectable } from '@nestjs/common';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as moment from 'moment';
import * as winston from 'winston';
import { format } from 'winston';
import * as purdy from 'purdy';
import { Config } from '../../../config/config';

const { combine, label } = format;

@Injectable()
export class Logger {
    private readonly logger: winston.Logger;

    private static _instance: Logger;
    static get instance(): Logger {
        return this._instance || (this._instance = new Logger());
    }

    private constructor(filename: string = '', outputFile: string = '') {
        if (!fs.existsSync(Config.get.storageDirectory())) {
            try {
                fs.mkdirSync(Config.get.storageDirectory());
            } catch (e) {
                console.error('Could not create log storage directory', e.code);
            }
        }

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
            let details;
            if (typeof info.details === 'string') {
                details = info.details ? info.details : '';
            } else if (typeof info.details === 'object') {
                try {
                    details = info.details ? '\n' + purdy.stringify(info.details, { indent: 2, depth: 10 }) : '';
                } catch (e) {
                    details = '[unable to stringify this context as it was circular or invalid]';
                }
            } else {
                details = info.details != null ? info.details : '';
            }
            const functionName = info.functionName ? chalk.magenta(chalk.italic(`${info.functionName}()`)) : '';
            return `${timestamp} ${level} ${functionName} ${message} ${details}`;
        });

        const options = {
            fileAllLogs: {
                level: 'info', // FIXME
                filename: Config.get.storageDirectory(outputFile.concat(Config.get.logs.filenames.all)),
                handleExceptions: true,
                json: true,
                colorize: false,
            },
            fileErrorLogs: {
                level: 'error',
                filename: Config.get.storageDirectory(outputFile.concat(Config.get.logs.filenames.error)),
                handleExceptions: true,
                json: true,
                colorize: false,
            },
            console: {
                format: consoleFormat,
            },
        };

        this.logger = winston.createLogger({
            level: 'debug',
            format: combine(label({ label: filename }), winston.format.json()),
            transports: [
                // new winston.transports.File(options.fileAllLogs),
                new winston.transports.File(options.fileErrorLogs),
                new winston.transports.Console(options.console),
            ],
        });
    }

    debug(message: string, context?: any, functionName?: string) {
        this.logger.debug({
            timestamp: moment().toISOString(),
            level: 'debug',
            functionName,
            message,
            details: context,
        });
    }

    log(message: string, context?: any, functionName?: string) {
        this.logger.info({
            timestamp: moment().toISOString(),
            level: 'info',
            functionName,
            message,
            details: context,
        });
    }

    error(message: string, context?: any, functionName?: string) {
        this.logger.error({
            timestamp: moment().toISOString(),
            level: 'error',
            functionName,
            message,
            details: context,
        });
    }

    warn(message: string, context?: any, functionName?: string) {
        this.logger.warn({
            timestamp: moment().toISOString(),
            level: 'warning',
            functionName,
            message,
            details: context,
        });
    }
}
