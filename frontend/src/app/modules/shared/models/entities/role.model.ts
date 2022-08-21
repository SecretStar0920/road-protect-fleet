import { Type } from 'class-transformer';
import { RolePermission } from '@modules/shared/models/entities/role-permission.model';

export class Role {
    roleId: number;
    name: string;

    @Type(() => RolePermission)
    permissions: RolePermission[];
}
