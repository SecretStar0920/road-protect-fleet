import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { vehicleNgrxHelper, VehicleState } from '@modules/vehicle/ngrx/vehicle.reducer';
import { plainToClass } from 'class-transformer';
import { CreateVehicleDto } from '@modules/vehicle/services/create-vehicle.dto';
import { UpdateVehicleDto } from '@modules/vehicle/services/update-vehicle.dto';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    constructor(private http: HttpService, private store: Store<VehicleState>) {}

    getAllVehicles() {
        return this.http.getSecure('vehicle').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Vehicle, item));
                }
                return [];
            }),
            tap((vehicles) => {
                this.store.dispatch(vehicleNgrxHelper.load({ items: vehicles }));
            }),
        );
    }

    getVehiclesForAccount(accountId: number) {
        return this.http.getSecure(`vehicle/account/${accountId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Vehicle, item));
                }
                return [];
            }),
            tap((vehicles) => {
                this.store.dispatch(vehicleNgrxHelper.addMany({ items: vehicles }));
            }),
        );
    }

    getVehicle(vehicleId: number): Observable<Vehicle> {
        return this.http.getSecure(`vehicle/${vehicleId}`).pipe(
            map((response: object) => {
                return plainToClass(Vehicle, response);
            }),
            tap((vehicle) => {
                this.store.dispatch(vehicleNgrxHelper.upsertOne({ item: vehicle }));
            }),
        );
    }

    createVehicle(dto: CreateVehicleDto): Observable<Vehicle> {
        dto.modelYear = moment(dto.modelYear).isValid() ? `${moment(dto.modelYear).year()}` : null;
        return this.http.postSecure('vehicle', dto).pipe(
            map((response: object) => {
                return plainToClass(Vehicle, response);
            }),
            tap((result) => {
                this.store.dispatch(vehicleNgrxHelper.upsertOne({ item: result }));
            }),
        );
    }

    updateVehicle(id: number, dto: UpdateVehicleDto): Observable<Vehicle> {
        return this.http.postSecure(`vehicle/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Vehicle, response);
            }),
            tap((result) => {
                this.store.dispatch(vehicleNgrxHelper.updateOne({ item: { id: result.vehicleId, changes: result } }));
            }),
        );
    }

    deleteVehicle(vehicleId: number): Observable<Vehicle> {
        return this.http.deleteSecure(`vehicle/${vehicleId}`).pipe(
            map((response: object) => {
                return plainToClass(Vehicle, response);
            }),
            tap((vehicle) => {
                this.store.dispatch(vehicleNgrxHelper.deleteOne({ id: `${vehicle.vehicleId}` }));
            }),
        );
    }
}
