import { Module } from '@nestjs/common';
import { RequestInformationLogController } from './controllers/request-information-log.controller';
import { CreateRequestInformationLogService } from './services/create-request-information-log.service';
import { RequestInformationFromIssuerService } from '@modules/request-information-log/services/request-information-from-issuer.service';
import { RequestInformationLogQueryController } from '@modules/request-information-log/controllers/request-information-log-query.controller';
import { GetRequestInformationLogService } from '@modules/request-information-log/services/get-request-information-log.service';
import { UpdateRequestInformationLogService } from '@modules/request-information-log/services/update-request-information-log.service';

@Module({
    controllers: [RequestInformationLogController, RequestInformationLogQueryController],
    providers: [
        CreateRequestInformationLogService,
        RequestInformationFromIssuerService,
        UpdateRequestInformationLogService,
        GetRequestInformationLogService,
    ],
    imports: [],
})
export class RequestInformationLogModule {}
