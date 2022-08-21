import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { BlacklistedAction } from '@entities';
import { Request } from 'express';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
/**
 * This guard works by checking the database for if the accountUser is blacklisted against any actions
 * This guard is useful for temporarily revoking a partner's access to a specific endpoint
 */
export class AclGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request & { identity: IdentityDto } = context.switchToHttp().getRequest();
        const identity = request.identity;

        if (!identity || !identity.user || !identity.accountUserId) {
            // Skip ACL check if not logged in
            return true;
        }
        const additionalActionAliases = this.reflector.get<string[]>('actions', context.getHandler()) || [];
        // [URL and method based resource blacklist, Class and function based ACL, Custom ACL names for merging ACL if needed]
        const actions = [
            `${request.method};${request.path}`,
            `${context.getClass().name}.${context.getHandler().name}`,
            ...additionalActionAliases,
        ];
        // Try and find this denied route for the accountUser
        const [deniedRoutes, count] = await BlacklistedAction.createQueryBuilder('actions')
            .leftJoinAndSelect('actions.accountUsers', 'accountUsers')
            .where('accountUsers.accountUserId = :accountUserId', { accountUserId: identity.accountUserId })
            .andWhere('actions.action in (:...actions)', { actions })
            .cache(60000)
            .getManyAndCount();

        const canCallRoute = count <= 0;
        if (!canCallRoute) {
            throw new ForbiddenException(ERROR_CODES.E069_DontHavePermission.message());
        }

        return canCallRoute;
    }
}

// tslint:disable-next-line:variable-name
export const Actions = (...actions: string[]) => SetMetadata('actions', actions);
