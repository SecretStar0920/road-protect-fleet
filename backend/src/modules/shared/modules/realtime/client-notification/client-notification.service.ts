import { Injectable } from '@nestjs/common';

import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

export class ClientNotificationDto {
    message: string;
    event?: string;
    type?: string;
    data?: any;
}

@Injectable()
export class ClientNotificationService {
    notify(socket: DistributedWebsocket, notification: ClientNotificationDto) {
        if (!notification.event) {
            notification.event = 'notification';
        }
        socket.emit(notification.event, notification);
    }
}
