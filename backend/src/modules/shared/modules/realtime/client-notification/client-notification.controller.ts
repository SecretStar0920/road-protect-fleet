import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RealtimeGateway } from '@modules/shared/modules/realtime/gateways/realtime.gateway';
import { SystemAdminGuard } from '@modules/auth/guards/system-admin.guard';
import { UserAuthGuard } from '@modules/auth/guards/user-auth.guard';

@Controller('client-notification')
@UseGuards(UserAuthGuard, SystemAdminGuard)
export class ClientNotificationController {
    constructor(private realtimeGateway: RealtimeGateway) {}

    @Post('all/:event')
    async sendEventToAll(@Param('event') event: string, @Body() data: any) {
        RealtimeGateway.server.emit(event, data);
        const clients = Object.keys(RealtimeGateway.server.sockets.sockets);
        return { event, data, notified: clients.length };
    }
}
