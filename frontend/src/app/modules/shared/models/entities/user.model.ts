import { Type } from 'class-transformer';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { Timestamped } from '@modules/shared/models/timestamped';
import { UserPreset } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';

export enum UserType {
    Admin = 'Admin',
    Developer = 'Developer',
    Standard = 'Standard',
    API = 'API',
}

export class User extends Timestamped {
    userId: number;
    email: string;
    type: UserType;
    name: string;
    surname: string;
    cellphoneNumber: string;
    completedSignup: boolean;
    frontendUserPreferences?: UserPreset = {};

    @Type(() => AccountUser)
    accounts: AccountUser[];
}
