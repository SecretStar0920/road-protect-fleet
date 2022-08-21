import { UserType } from '@entities';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class NotApiGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const identity: IdentityDto = request.identity || {};
        const user = identity.user;
        if (!user) {
            throw new ForbiddenException(ERROR_CODES.E060_UserNotFound.message());
        }

        const isApi = user.type === UserType.API;
        if (isApi) {
            throw new ForbiddenException(ERROR_CODES.E070_UseFrontendToPerformAction.message());
        }
        return true;
    }
}
