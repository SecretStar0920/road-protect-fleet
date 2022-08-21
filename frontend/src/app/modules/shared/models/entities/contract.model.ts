import { Timestamped } from '@modules/shared/models/timestamped';
import { Type } from 'class-transformer';
import { Document } from '@modules/shared/models/entities/document.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Driver } from '@modules/shared/models/entities/driver.model';

export enum ContractStatus {
    Upcoming = 'Upcoming',
    Missing = 'Missing',
    Expired = 'Expired',
    ExpiringSoon = 'Expiring soon',
    Valid = 'Valid',
}

export enum ContractType {
    Lease = 'Lease',
    Ownership = 'Ownership',
    Driver = 'Driver',
}

export enum ContractOcrStatus {
    Success = 'Success',
    Failed = 'Failed',
    Incomplete = 'Incomplete',
    Modified = 'Modified',
}

export class Contract extends Timestamped {
    contractId: number;

    startDate: string;
    endDate: string;

    reference: string;

    status: ContractStatus;

    type: ContractType;

    @Type(() => Account)
    owner: Account;

    @Type(() => Account)
    user: Account;

    @Type(() => Infringement)
    infringements: Infringement[];

    @Type(() => Vehicle)
    vehicle: Vehicle;

    @Type(() => Document)
    document: Document;
}

export class OwnershipContract extends Contract {
    type = ContractType.Ownership;

    @Type(() => Vehicle)
    currentOwnershipForVehicle: Vehicle;
}

export class LeaseContract extends Contract {
    type = ContractType.Lease;

    ocrStatus: ContractOcrStatus;

    @Type(() => Account)
    user: Account;

    @Type(() => Vehicle)
    currentLeaseForVehicle: Vehicle;

    @Type(() => Document)
    redirectionDocument: Document;
}

export class DriverContract extends Contract {
    type = ContractType.Driver;

    @Type(() => Vehicle)
    currentDriverForVehicle: Vehicle;

    @Type(() => Driver)
    driver: Driver;
}
