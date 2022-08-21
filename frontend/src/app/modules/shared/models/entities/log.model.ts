import { Timestamped } from '@modules/shared/models/timestamped';
import { Type } from 'class-transformer';
import { Account } from '@modules/shared/models/entities/account.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { User } from '@modules/shared/models/entities/user.model';

export enum LogType {
    Created = 'Created',
    Success = 'Success',
    Error = 'Error',
    Updated = 'Updated',
    Warning = 'Warning',
}

export enum LogPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export class Log extends Timestamped {
    logId: number;

    message: string;

    type: LogType;

    priority: LogPriority;

    @Type(() => Account)
    account: Account;

    @Type(() => Infringement)
    infringement: Infringement;

    @Type(() => Vehicle)
    vehicle: Vehicle;

    @Type(() => User)
    user: User;
}
