import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { Role, RolePermission } from '@entities';
import { uniq } from 'lodash';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

@Injectable()
export class GetRoleService {
    constructor(private logger: Logger) {}

    async getRole(roleId: number): Promise<Role> {
        this.logger.log({ message: `Getting Role with id: `, detail: roleId, fn: this.getRole.name });
        const role = await Role.findOne(roleId);
        if (!role) {
            throw new BadRequestException({ message: ERROR_CODES.E031_CouldNotFindRole.message({ roleId }) });
        }
        this.logger.log({ message: `Found Role with id: `, detail: role.roleId, fn: this.getRole.name });
        return role;
    }

    async getCurrentRole(accountUserId: number) {
        this.logger.log({ message: `Getting Current User Role with accountUserId: `, detail: accountUserId, fn: this.getRole.name });
        const role = await Role.findWithMinimalRelation()
            .innerJoin('role.accountUsers', 'accountUsers')
            .innerJoin('accountUsers.accountUser', 'accountUser', 'accountUser.accountUserId = :id', { id: accountUserId })
            .getOne();
        if (!role) {
            throw new BadRequestException({ message: ERROR_CODES.E031_CouldNotFindRole.message() });
        }
        this.logger.log({ message: `Found Role with id: `, detail: role.roleId, fn: this.getRole.name });
        return role;
    }

    async getMyPermissions(accountUserId: number) {
        this.logger.log({
            message: `Getting Current User Permissions with accountUserId: `,
            detail: accountUserId,
            fn: this.getMyPermissions.name,
        });
        const roles = await Role.findWithMinimalRelation()
            .innerJoin('role.accountUsers', 'accountUsers')
            .innerJoin('accountUsers.accountUser', 'accountUser', 'accountUser.accountUserId = :id', { id: accountUserId })
            .getMany();
        if (!roles) {
            throw new BadRequestException({ message: ERROR_CODES.E031_CouldNotFindRole.message() });
        }
        this.logger.log({ message: `Found ${roles.length} Roles `, fn: this.getMyPermissions.name });
        const permissions: RolePermission[] = [];
        for (const role of roles) {
            permissions.push(...role.permissions);
        }
        // remove duplicate permissions
        return uniq(permissions);
    }
}
