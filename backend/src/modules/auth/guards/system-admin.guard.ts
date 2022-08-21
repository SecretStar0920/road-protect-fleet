import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserType } from '@entities';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class SystemAdminGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const identity: IdentityDto = request.identity || {};
        const user = identity.user;
        if (!user) {
            throw new ForbiddenException(ERROR_CODES.E060_UserNotFound.message());
        }

        const isSystemAdmin = user.type === UserType.Developer || user.type === UserType.Admin;
        if (!isSystemAdmin) {
            throw new ForbiddenException(ERROR_CODES.E071_MustBeSystemAdmin.message());
        }
        return true;
    }
}
