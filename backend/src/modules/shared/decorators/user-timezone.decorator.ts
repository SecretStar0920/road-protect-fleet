import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { get } from 'lodash';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { Client } from '@entities';

// tslint:disable-next-line:variable-name
export const UserTimezone = createParamDecorator((data, context: ExecutionContext) => {
    const req: Request & { identity?: IdentityDto; client?: Client } = context.switchToHttp().getRequest();

    if (!get(req, 'cookies.timezone', false)) {
        return 'Asia/Jerusalem';
    }

    return get(req, 'cookies.timezone');
});

// tslint:disable-next-line:variable-name
export const UserCountry = createParamDecorator((data, context: ExecutionContext) => {
    const req: Request & { identity?: IdentityDto; client?: Client } = context.switchToHttp().getRequest();

    if (!get(req, 'cookies.country', false)) {
        return 'IL';
    }

    return get(req, 'cookies.country');
});
