import { Type } from 'class-transformer';
import { Role } from '@modules/shared/models/entities/role.model';
import { Permission } from '@modules/shared/models/entities/permission.model';

export class RolePermission {
    rolePermissionId: number;

    @Type(() => Role)
    role: Role;
    @Type(() => Permission)
    permission: Permission;
}
