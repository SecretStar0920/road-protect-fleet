import { WebsocketPropagatorService } from '@modules/shared/modules/socket-state/websocket-propagator.service';
import { Socket } from 'socket.io';

export class DistributedWebsocket {
    constructor(private socket: Socket) {}

    async emit(event: string, ...args: any[]) {
        return this.distributeEmit(event, ...args);
    }

    async distributeEmit(event: string, ...args: any[]) {
        return WebsocketPropagatorService.instance.emit(this.socket.id, event, args.length === 1 ? args[0] : args);
    }

    emitToClient(event: string, ...args: any[]) {
        this.socket.emit(event, ...args);
    }
}
