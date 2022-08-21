import { Timestamped } from '@modules/shared/models/timestamped';
import { Type } from 'class-transformer';
import { Document } from '@modules/shared/models/entities/document.model';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';

export class VehicleDocument extends Timestamped {
    vehicleDocumentId: number;

    @Type(() => Vehicle)
    vehicle: Vehicle;

    @Type(() => Document)
    document: Document;
}
