import { User } from '@modules/shared/models/entities/user.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { Type } from 'class-transformer';
import { AccountUserRole } from '@modules/shared/models/entities/account-user-role.model';
import { Timestamped } from '@modules/shared/models/timestamped';

export class AccountUser extends Timestamped {
    accountUserId: number;
    @Type(() => User)
    user: User;
    @Type(() => Account)
    account: Account;
    @Type(() => AccountUserRole)
    roles: AccountUserRole[];
    hidden: boolean;
}
