import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { isEmpty, some } from 'lodash';
import { Permission, UserType } from '@entities';
import { Request } from 'express';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.get<{ name: string; group: string }[]>('permissions', context.getHandler());
        const request: Request & { identity: IdentityDto } = context.switchToHttp().getRequest();
        const identity = request.identity;

        if (isEmpty(permissions)) {
            return true;
        }

        if (!identity.user || !identity.accountUserId) {
            throw new ForbiddenException(ERROR_CODES.E068_MissingLoginDetails.message());
        }

        // Check first if the user is a system admin or developer, if so we can ignore the permission check
        if (identity.user.type === UserType.Admin || identity.user.type === UserType.Developer) {
            return true;
        }

        // Check permissions
        const userPermissions = await Permission.createQueryBuilder('permission')
            .innerJoinAndSelect('permission.roles', 'roles')
            .innerJoinAndSelect('roles.role', 'role')
            .innerJoinAndSelect('role.accountUsers', 'accountUsers')
            .innerJoinAndSelect('accountUsers.accountUser', 'accountUser', 'accountUser.accountUserId = :accountUserId', {
                accountUserId: identity.accountUserId,
            })
            .getMany();

        // Check the user has at-least one of the roles required
        const hasPermissions = some(userPermissions, (userPermission) => {
            return some(permissions, (permission) => userPermission.name === permission.name);
        });

        if (!hasPermissions) {
            throw new ForbiddenException(ERROR_CODES.E069_DontHavePermission.message({ permission: permissions.toString() }));
        }

        return hasPermissions;
    }
}

// tslint:disable-next-line:variable-name
export const Permissions = (...permissions: { name: string; group: string }[]) => SetMetadata('permissions', permissions);
