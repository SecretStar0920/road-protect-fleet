import { Injectable } from '@nestjs/common';
import { BaseSeederService } from '@seeder/seeders/base-seeder.service';
import { Permission, Role, RolePermission } from '@entities';
import { cloneDeep, find } from 'lodash';
import { ROLE_PERMISSIONS } from '@modules/shared/models/role-permissions.const';

@Injectable()
export class RoleSeederService extends BaseSeederService<Role> {
    protected seederName: string = 'Role';

    constructor() {
        super();
    }

    async setSeedData() {
        const permissions = await Permission.find();

        for (const rolePermissionValue of ROLE_PERMISSIONS) {
            this.seedData.push({
                name: rolePermissionValue.name,
                permissions: await this.createRolePermissions(permissions, rolePermissionValue.permissions),
            });
        }
    }

    private async createRolePermissions(
        permissions: Permission[],
        requiredPermissions: { name: string; group: string }[],
    ): Promise<RolePermission[]> {
        const permissionsClone = cloneDeep(permissions).filter((permission) => {
            const name = permission.name;
            return find(requiredPermissions, { name });
        });
        return permissionsClone.map((permission) => {
            return RolePermission.create({ permission });
        });
    }

    async seedItemFunction(item: Partial<Role>) {
        return Role.create(item).save();
    }
}
