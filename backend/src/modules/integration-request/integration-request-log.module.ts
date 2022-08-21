import { IntegrationRequestLogQueryController } from '@modules/integration-request/controllers/integration-request-log-query.controller';
import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { Module } from '@nestjs/common';
import { IntegrationRequestLogController } from './controllers/integration-request-log.controller';

@Module({
    controllers: [IntegrationRequestLogQueryController, IntegrationRequestLogController],
    providers: [IntegrationRequestLogger],
    exports: [IntegrationRequestLogger],
})
export class IntegrationRequestLogModule {}
