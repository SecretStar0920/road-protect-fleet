import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission, Role, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class RolePermission extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    rolePermissionId: number;

    @ManyToOne((type) => Role, (role) => role.permissions)
    @JoinColumn({ name: 'roleId', referencedColumnName: 'roleId' })
    @Index()
    @ApiProperty({ description: 'Role', type: 'object' })
    role: Role;

    // @Column('int', { name: 'roleId' })
    // roleId: number;

    @ManyToOne((type) => Permission, (permission) => permission.roles, { eager: true })
    @JoinColumn({ name: 'permissionId', referencedColumnName: 'permissionId' })
    @Index()
    @ApiProperty({ description: 'Permission', type: 'object' })
    permission: Permission;
    //
    // @Column('int', { name: 'permissionId' })
    // permissionId: number;
}
