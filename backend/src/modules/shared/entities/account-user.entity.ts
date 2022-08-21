import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    SelectQueryBuilder,
    Unique,
} from 'typeorm';
import { Account, AccountUserRole, Role, TimeStamped, User } from '@entities';
import { some } from 'lodash';
import { IDatabaseConstraints } from '@modules/shared/models/database-constraints.interface';
import { BlacklistedAction } from '@modules/shared/entities/blacklisted-action.entity';
import { ApiProperty } from '@nestjs/swagger';

export const ACCOUNT_USER_CONSTRAINTS: IDatabaseConstraints = {
    noDuplicateUser: {
        keys: ['user', 'account'],
        constraint: 'no_duplicate_user',
        description: 'This user is already associated with this account',
    },
};

@Entity()
@Unique(ACCOUNT_USER_CONSTRAINTS.noDuplicateUser.constraint, ACCOUNT_USER_CONSTRAINTS.noDuplicateUser.keys)
export class AccountUser extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    @ApiProperty()
    accountUserId: number;

    @Column('bool', { default: false })
    @ApiProperty()
    hidden: boolean;

    @ManyToOne((type) => User, (user) => user.accounts, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'User' })
    user: User;

    @Column('int', { name: 'userId' })
    @ApiProperty()
    userId: number;

    @ManyToOne((type) => Account, (account) => account.users, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'accountId', referencedColumnName: 'accountId' })
    @Index()
    @ApiProperty({ type: 'object', description: 'Account' })
    account: Account;
    //
    // @Column('int', { name: 'accountId' })
    // accountId: number;

    @OneToMany((type) => AccountUserRole, (accountUserRole) => accountUserRole.accountUser, {
        cascade: true,
        eager: true,
    })
    @ApiProperty({ type: 'object', description: 'AccountUserRole[]' })
    roles: AccountUserRole[];

    @ManyToMany((type) => BlacklistedAction, (action) => action.accountUsers, { eager: true })
    @JoinTable({ name: 'account_user_blacklisted_actions' })
    @ApiProperty({ type: 'object', description: 'BlacklistedAction[]' })
    blacklistedActions: BlacklistedAction[];

    /**
     * Adds the given role to this entity
     * Note: does not save
     */
    async addRole(role: Role): Promise<void> {
        const hasRole = some(this.roles, (userRole: AccountUserRole) => {
            return userRole.role.name === role.name;
        });
        if (hasRole) {
            return;
        }
        const accountUserRole = AccountUserRole.create({ role, accountUser: this });
        // Populate roles if it wasn't joined
        if (!this.roles) {
            this.roles = await AccountUserRole.find({
                accountUser: { accountUserId: this.accountUserId },
            });
        }
        this.roles.push(accountUserRole);
    }

    static findWithMinimalRelations(): SelectQueryBuilder<AccountUser> {
        return this.createQueryBuilder('accountUser')
            .leftJoin('accountUser.account', 'account')
            .addSelect(['account.accountId', 'account.name'])
            .leftJoin('accountUser.user', 'user')
            .addSelect(['user.email', 'user.name', 'user.surname', 'user.userId'])
            .leftJoinAndSelect('accountUser.roles', 'roles')
            .leftJoinAndSelect('roles.role', 'role');
    }
}
