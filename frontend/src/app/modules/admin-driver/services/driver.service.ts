import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { driverNgrxHelper, DriverState } from '@modules/admin-driver/ngrx/driver.reducer';
import { Driver } from '@modules/shared/models/entities/driver.model';
import { CreateDriverDto } from '@modules/admin-driver/services/create-driver.dto';
import { UpdateDriverDto } from '@modules/admin-driver/services/update-driver.dto';

@Injectable({
    providedIn: 'root',
})
export class DriverService {
    constructor(private http: HttpService, private store: Store<DriverState>) {}

    getDriver(driverId: number) {
        return this.http.getSecure(`driver/${driverId}`).pipe(
            map((response) => {
                return plainToClass(Driver, response);
            }),
            tap((driver) => {
                if (driver) {
                    this.store.dispatch(driverNgrxHelper.upsertOne({ item: driver }));
                }
            }),
        );
    }

    createDriver(dto: CreateDriverDto): Observable<Driver> {
        return this.http.postSecure('driver', dto).pipe(
            map((response: object) => {
                return plainToClass(Driver, response);
            }),
            tap((result) => {
                this.store.dispatch(driverNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateDriver(driverId: number, dto: UpdateDriverDto): Observable<Driver> {
        return this.http.postSecure(`driver/${driverId}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Driver, response);
            }),
            tap((result) => {
                this.store.dispatch(driverNgrxHelper.updateOne({ item: { id: driverId, changes: result } }));
            }),
        );
    }

    deleteDriver(driverId: number) {
        return this.http.deleteSecure(`driver/${driverId}`).pipe(
            map((response: object) => {
                return plainToClass(Driver, response);
            }),
            tap((driver) => {
                return this.store.dispatch(driverNgrxHelper.deleteOne({ id: `${driver.driverId}` }));
            }),
        );
    }
}
