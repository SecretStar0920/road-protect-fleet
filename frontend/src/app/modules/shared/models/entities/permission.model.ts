import { Type } from 'class-transformer';
import { RolePermission } from '@modules/shared/models/entities/role-permission.model';

export class Permission {
    permissionId: number;
    name: string;
    group: string;

    @Type(() => RolePermission)
    roles: RolePermission[];
}
