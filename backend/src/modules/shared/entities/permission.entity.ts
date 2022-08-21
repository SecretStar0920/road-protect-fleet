import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Permission extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    permissionId: number;

    @Column('text')
    @ApiProperty()
    name: string;

    @Column('text')
    @ApiProperty()
    group: string;

    @OneToMany((type) => RolePermission, (rolePermission) => rolePermission.permission)
    @ApiProperty({ description: 'RolePermission[]', type: 'object' })
    roles: RolePermission[];
}
