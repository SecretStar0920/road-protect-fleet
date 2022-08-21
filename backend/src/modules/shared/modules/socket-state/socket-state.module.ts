import { Module } from '@nestjs/common';
import { SocketStateService } from '@modules/shared/modules/socket-state/socket-state.service';
import { RedisModule } from '@modules/shared/modules/redis/redis.module';
import { WebsocketPropagatorService } from '@modules/shared/modules/socket-state/websocket-propagator.service';

@Module({
    imports: [RedisModule],
    providers: [SocketStateService, WebsocketPropagatorService],
    exports: [SocketStateService, WebsocketPropagatorService],
})
export class SocketStateModule {}
