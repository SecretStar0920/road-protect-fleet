import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { AccountUserRole, RolePermission, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    roleId: number;

    @Column('text', { unique: true })
    @ApiProperty()
    name: string;

    @OneToMany((type) => AccountUserRole, (accountUserRole) => accountUserRole.role)
    @ApiProperty({ description: 'AccountUserRole[]', type: 'object' })
    accountUsers: AccountUserRole[];

    @OneToMany((type) => RolePermission, (rolePermission) => rolePermission.role, {
        cascade: true,
        onDelete: 'CASCADE',
        eager: true,
    })
    @ApiProperty({ description: 'RolePermission[]', type: 'object' })
    permissions: RolePermission[];

    static findWithMinimalRelation(): SelectQueryBuilder<Role> {
        return this.createQueryBuilder('role')
            .leftJoin('role.permissions', 'permissions')
            .addSelect(['permissions.permission', 'permissions.rolePermissionId'])
            .innerJoin('permissions.permission', 'permission')
            .addSelect(['permission.permissionId', 'permission.name', 'permission.group']);
    }
}
