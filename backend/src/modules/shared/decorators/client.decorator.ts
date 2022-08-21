import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Client } from '@entities';

// tslint:disable-next-line:variable-name
export const ClientDecorator = createParamDecorator((data, context: ExecutionContext) => {
    const req: Request & { identity?: IdentityDto; client?: Client } = context.switchToHttp().getRequest();

    return req.client;
});
