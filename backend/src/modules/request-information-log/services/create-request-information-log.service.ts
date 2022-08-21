import { Injectable } from '@nestjs/common';
import { CreateRequestInformationLogDto } from '@modules/request-information-log/controllers/request-information-log.controller';
import { Logger } from '@logger';
import { RequestInformationLog } from '@entities';
import { isNil, omitBy } from 'lodash';
import { databaseExceptionHelper } from '@modules/shared/helpers/database-exception-catcher.helper';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class CreateRequestInformationLogService {
    constructor(private logger: Logger) {}

    @Transactional()
    async createRequestInformationLog(dto: CreateRequestInformationLogDto): Promise<RequestInformationLog> {
        this.logger.debug({ message: 'Creating RequestInformationLog', fn: this.createRequestInformationLog.name });
        const data = omitBy(dto, isNil);
        data.dump = dto;
        let requestInformationLog;

        try {
            requestInformationLog = await RequestInformationLog.create(data).save();
        } catch (e) {
            databaseExceptionHelper(e, {}, 'Failed to create requestInformationLog, please contact the developers.');
        }
        this.logger.debug({
            message: 'Created RequestInformationLog',
            fn: this.createRequestInformationLog.name,
        });
        return requestInformationLog;
    }
}
