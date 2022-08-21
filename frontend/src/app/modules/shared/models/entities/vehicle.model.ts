import { Timestamped } from '@modules/shared/models/timestamped';
import { Type } from 'class-transformer';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Contract, LeaseContract, OwnershipContract } from '@modules/shared/models/entities/contract.model';
import { VehicleDocument } from '@modules/shared/models/entities/vehicle-document.model';
import { Log } from '@modules/shared/models/entities/log.model';

export enum NominationTarget {
    Owner = 'Owner',
    User = 'User',
    // Driver = 'Driver',
}

export enum VehicleType {
    Private = 'Private',
    Truck = 'Truck',
}

export class Vehicle extends Timestamped {
    vehicleId: number;
    registration: string;
    manufacturer: string;
    model: string;
    modelYear: string;
    color: string;
    category: string;
    weight: number;
    autoAssignTo: NominationTarget;
    type: VehicleType;

    @Type(() => Infringement)
    infringements: Infringement[];

    @Type(() => Contract)
    contracts: Contract[];

    @Type(() => LeaseContract)
    currentLeaseContract: LeaseContract;

    @Type(() => OwnershipContract)
    currentOwnershipContract: OwnershipContract;

    @Type(() => VehicleDocument)
    documents: VehicleDocument[];

    @Type(() => Log)
    logs: Log[];
}
