import { Timestamped } from '@modules/shared/models/timestamped';
import { Type } from 'class-transformer';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { PhysicalLocation, PostalLocation } from '@modules/shared/models/entities/location.model';

export class Driver extends Timestamped {
    driverId: number;
    name: string;
    surname: string;
    idNumber: string;
    licenseNumber: string;
    email: string;
    cellphoneNumber?: string;

    @Type(() => PhysicalLocation)
    physicalLocation: PhysicalLocation;

    @Type(() => PostalLocation)
    postalLocation: PostalLocation;

    @Type(() => Contract)
    asDriver: Contract;
}
