import { Timestamped } from '@modules/shared/models/timestamped';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Type } from 'class-transformer';
import { GeocodingResponse } from '@google/maps';

export enum LocationType {
    Physical = 'Physical',
    Postal = 'Postal',
}

export class Location extends Timestamped {
    type: LocationType;
    locationId: number;

    city: string;

    country: string;

    code: string;

    proximity: string;

    rawAddress: string;

    address: string; // Calculated on the backend;

    // GOOGLE RESPONSE

    formattedAddress: string; // Google formatted address

    @Type(() => Infringement)
    infringement: Infringement;

    toString(): string {
        return this.address;
    }
}

export class PhysicalLocation extends Location {
    type: LocationType = LocationType.Physical;
    streetName: string;
    streetNumber: string;
    googleLocation: GeocodingResponse;
    hasGoogleResult: boolean;
}
export class PostalLocation extends Location {
    type: LocationType = LocationType.Postal;
    postOfficeBox: string;
}
