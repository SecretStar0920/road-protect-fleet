import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Logger } from '@logger';
import { isNil } from 'lodash';
import { Client } from '@entities';

// tslint:disable-next-line:variable-name
export const Identity = createParamDecorator(async (data, context: ExecutionContext) => {
    const req: Request & { identity?: IdentityDto; client?: Client } = context.switchToHttp().getRequest();

    if (isNil(req.identity)) {
        Logger.instance.error({ message: 'Missing request identity', fn: 'IdentityDecorator' });
    }
    return req.identity || {};
});
