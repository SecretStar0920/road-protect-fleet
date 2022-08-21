import { User } from '@modules/shared/models/entities/user.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { Type } from 'class-transformer';
import { Timestamped } from '@modules/shared/models/timestamped';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';

export class VehicleAccount extends Timestamped {
    vehicleAccountId: number;
    @Type(() => User)
    vehicle: Vehicle;
    @Type(() => Account)
    account: Account;
}
