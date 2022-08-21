import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Location } from '@modules/shared/models/entities/location.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { locationNgrxHelper, LocationState } from '@modules/location/ngrx/location.reducer';
import { plainToClass } from 'class-transformer';
import { CreateLocationDetailedDto } from '@modules/location/services/create-location-detailed.dto';
import { UpdateLocationDetailedDto } from '@modules/location/services/update-location-detailed.dto';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    constructor(private http: HttpService, private store: Store<LocationState>) {}

    getAllLocations() {
        return this.http.getSecure('location').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Location, item));
                }
                return [];
            }),
            tap((locations) => {
                this.store.dispatch(locationNgrxHelper.load({ items: locations }));
            }),
        );
    }

    getLocation(locationId: number) {
        return this.http.getSecure(`location/${locationId}`).pipe(
            map((response: object) => {
                return plainToClass(Location, response);
            }),
            tap((location) => {
                this.store.dispatch(locationNgrxHelper.upsertOne({ item: location }));
            }),
        );
    }

    createLocation(dto: CreateLocationDetailedDto): Observable<Location> {
        return this.http.postSecure('location', dto).pipe(
            map((response: object) => {
                return plainToClass(Location, response);
            }),
            tap((result) => {
                this.store.dispatch(locationNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateLocation(id: number, dto: UpdateLocationDetailedDto): Observable<Location> {
        return this.http.postSecure(`location/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Location, response);
            }),
            tap((result) => {
                this.store.dispatch(locationNgrxHelper.updateOne({ item: { id: result.locationId, changes: result } }));
            }),
        );
    }

    deleteLocation(locationId: number) {
        return this.http.deleteSecure(`location/${locationId}`).pipe(
            map((response: object) => {
                return plainToClass(Location, response);
            }),
            tap((location) => {
                this.store.dispatch(locationNgrxHelper.deleteOne({ id: `${location.locationId}` }));
            }),
        );
    }
}
