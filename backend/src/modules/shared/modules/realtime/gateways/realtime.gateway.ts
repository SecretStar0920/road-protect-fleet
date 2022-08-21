import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@logger';
import { SocketStateService } from '@modules/shared/modules/socket-state/socket-state.service';
import { DistributedWebsocket } from '@modules/shared/modules/socket-state/distributed-websocket';

@WebSocketGateway({ cookie: false })
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private logger: Logger) {}

    public static server: Server;

    afterInit(server: Server) {
        RealtimeGateway.server = server;
    }

    handleDisconnect(client: Socket) {
        this.logger.log({
            message: `Client disconnected: ${client.id}`,
            detail: this.getConnectedDetails(),
            fn: this.handleDisconnect.name,
        });
        SocketStateService.instance.remove(client.id);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log({ message: `Client connected: ${client.id}`, detail: this.getConnectedDetails(), fn: this.handleConnection.name });
        SocketStateService.instance.add(client.id, new DistributedWebsocket(client));
    }

    getConnectedDetails() {
        const connections = RealtimeGateway.server.sockets.connected;
        const connectedIds = Object.keys(connections);
        const count = connectedIds.length;

        return { count, connectedIds };
    }
}
