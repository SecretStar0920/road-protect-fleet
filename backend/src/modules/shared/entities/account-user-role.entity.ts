import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AccountUser, Role, TimeStamped } from '@entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AccountUserRole extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    accountUserRoleId: number;

    @ManyToOne((type) => AccountUser, (accountUser) => accountUser.roles, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'accountUserId', referencedColumnName: 'accountUserId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'AccountUser' })
    accountUser: AccountUser;

    @ManyToOne((type) => Role, (role) => role.accountUsers, { eager: true, nullable: false })
    @JoinColumn({ name: 'roleId', referencedColumnName: 'roleId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Role' })
    role: Role;

    @Column('int', { name: 'roleId' })
    @ApiProperty()
    roleId: number;
}
