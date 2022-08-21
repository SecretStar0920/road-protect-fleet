import { Integration, IntegrationRequestLog } from '@entities';
import { Logger } from '@logger';
import { omitUnreadable } from '@modules/shared/helpers/omit-unreadable';
import { Injectable } from '@nestjs/common';

export class IntegrationRequestLogDto {
    type: Integration;
    request: any;
    response: any;
    details: any = {};
}

@Injectable()
export class IntegrationRequestLogger {
    private logger = Logger.instance;
    private static _instance: IntegrationRequestLogger;
    static get instance(): IntegrationRequestLogger {
        return this._instance || (this._instance = new IntegrationRequestLogger());
    }

    async logSuccessful(type: Integration, request: any, response: any, details: any = {}): Promise<void> {
        const dto = { type, request, response, details };
        try {
            await IntegrationRequestLog.create(dto).save();
        } catch (error) {
            this.logger.error({
                message: 'Failed to log successful integration request',
                fn: this.logSuccessful.name,
                detail: {
                    dto,
                    error,
                },
            });
        }
    }

    async logFailed(type: Integration, request: any, response: any, details: any = {}): Promise<void> {
        const dto = { type, request, response: omitUnreadable(response), details, success: false};
        try {
            await IntegrationRequestLog.create(dto).save();
        } catch (error) {
            this.logger.error({
                message: 'Failed to log failed integration request',
                fn: this.logSuccessful.name,
                detail: {
                    dto,
                    error,
                },
            });
        }
    }
}
