import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { RequestInformationLog } from '@entities';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetRequestInformationLogService {
    constructor(private logger: Logger) {}

    async getRequestInformationLog(requestInformationLogId: number): Promise<RequestInformationLog> {
        this.logger.log({
            message: `Getting Request Information Log with id: `,
            detail: requestInformationLogId,
            fn: this.getRequestInformationLog.name,
        });
        const requestInformationLog = await RequestInformationLog.findWithMinimalRelations()
            .andWhere('information_request.requestInformationLogId = :id', { id: requestInformationLogId })
            .getOne();
        if (!requestInformationLog) {
            throw new BadRequestException({
                message: ERROR_CODES.E152_CouldNotFindRequestInformationLog.message({ requestInformationLogId }),
            });
        }
        this.logger.log({
            message: `Found Request Information Log with id: `,
            detail: requestInformationLog.requestInformationLogId,
            fn: this.getRequestInformationLog.name,
        });
        return requestInformationLog;
    }

    async getAll(): Promise<RequestInformationLog[]> {
        this.logger.log({ message: `Getting Request Information Logs`, detail: null, fn: this.getRequestInformationLog.name });
        const requestInformationLogs = await RequestInformationLog.findWithMinimalRelations().getMany();
        this.logger.log({
            message: `Found Request Information Logs, length: `,
            detail: requestInformationLogs.length,
            fn: this.getRequestInformationLog.name,
        });
        return requestInformationLogs;
    }
}
