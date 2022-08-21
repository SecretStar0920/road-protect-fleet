import { Injectable } from '@nestjs/common';
import { merge } from 'lodash';
import { Logger } from '@logger';
import { RequestInformationLog } from '@entities';
import { UpdateRequestInformationLogDto } from '@modules/request-information-log/controllers/request-information-log.controller';

@Injectable()
export class UpdateRequestInformationLogService {
    constructor(private logger: Logger) {}

    async updateRequestInformationLog(id: number, dto: UpdateRequestInformationLogDto): Promise<RequestInformationLog> {
        this.logger.log({ message: 'Updating user: ', detail: merge({ id }, dto), fn: this.updateRequestInformationLog.name });
        let requestInformationLog = await RequestInformationLog.findWithMinimalRelations()
            .andWhere('information_request.requestInformationLogId = :id', { id })
            .getOne();
        requestInformationLog = merge(requestInformationLog, dto);
        await requestInformationLog.save();
        this.logger.log({ message: 'Updated user: ', detail: id, fn: this.updateRequestInformationLog.name });
        return requestInformationLog;
    }
}
