import { Module } from '@nestjs/common';
import { RealtimeGateway } from './gateways/realtime.gateway';
import { ClientNotificationController } from './client-notification/client-notification.controller';
import { ClientNotificationService } from './client-notification/client-notification.service';

@Module({
    providers: [RealtimeGateway, ClientNotificationService],
    exports: [RealtimeGateway, ClientNotificationService],
    controllers: [ClientNotificationController],
})
export class RealtimeModule {}
