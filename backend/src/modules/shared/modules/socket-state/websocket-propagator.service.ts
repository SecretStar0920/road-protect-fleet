import { Global, OnModuleInit } from '@nestjs/common';
import { RedisService } from '@modules/shared/modules/redis/redis.service';
import { SocketStateService } from '@modules/shared/modules/socket-state/socket-state.service';
import { fromEvent } from 'rxjs';
import { Logger } from '@logger';

@Global()
export class WebsocketPropagatorService implements OnModuleInit {
    private readonly WEBSOCKET_EVENT_KEY = 'WEBSOCKET_EVENT';

    static instance: WebsocketPropagatorService;

    constructor(private redisService: RedisService, private logger: Logger) {
        WebsocketPropagatorService.instance = this;
    }

    async onModuleInit() {
        fromEvent(this.redisService.client(), this.WEBSOCKET_EVENT_KEY).subscribe((incomingEvent: string) => {
            const { socketId, event, payload } = JSON.parse(incomingEvent) as { socketId: string; event: string; payload: any };
            const socket = SocketStateService.instance.get(socketId);
            if (socket) {
                try {
                    socket.emitToClient(event, payload);
                } catch (e) {
                    this.logger.error({
                        fn: this.onModuleInit.name,
                        message: `Failed to propagate event to socket with id ${socketId}`,
                        detail: { socketId, event },
                    });
                }
            }
        });
    }

    async emit(socketId: string, event: string, payload: any) {
        return this.redisService.client().emit(this.WEBSOCKET_EVENT_KEY, JSON.stringify({ socketId, event, payload }));
    }
}
