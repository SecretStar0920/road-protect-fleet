import { Role } from '@modules/shared/models/entities/role.model';
import { Type } from 'class-transformer';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { Timestamped } from '@modules/shared/models/timestamped';

export class AccountUserRole extends Timestamped {
    accountUserRoleId: number;
    @Type(() => AccountUser)
    accountUser: AccountUser;
    @Type(() => Role)
    role: Role;
}
