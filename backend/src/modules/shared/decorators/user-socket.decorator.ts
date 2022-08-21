import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { get, isNil } from 'lodash';
import { RealtimeGateway } from '@modules/shared/modules/realtime/gateways/realtime.gateway';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Client } from '@entities';
import { Logger } from '@logger';
import { SocketStateService } from '@modules/shared/modules/socket-state/socket-state.service';

export const safeSocket = {
    emit: (...args) => {
        Logger.instance.warn({ message: 'Socket emit called, but no real instance connected', detail: args, fn: 'safeSocket' });
        return {
            message: 'No socket connected ',
            ...args,
        };
    },
};

// tslint:disable-next-line:variable-name
export const UserSocket = createParamDecorator((data, context: ExecutionContext) => {
    const req: Request & { identity?: IdentityDto; client?: Client } = context.switchToHttp().getRequest();

    if (isNil(RealtimeGateway.server)) {
        return safeSocket;
    }

    if (!get(req, 'headers.io', false)) {
        return safeSocket;
    }

    const socketId = get(req, 'headers.io');
    return SocketStateService.instance.get(socketId) || safeSocket;
});
