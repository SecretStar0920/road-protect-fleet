import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { City, Street } from '@modules/shared/models/entities/street.model';
import { HttpService } from '@modules/shared/services/http/http.service';
import { streetNgrxHelper, StreetState } from '@modules/street/ngrx/street.reducer';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class StreetService {
    constructor(private http: HttpService, private store: Store<StreetState>) {}

    getStreets(street: string, issuer: string) {
        let endpoint = street ? `street/${street}` : 'street';
        endpoint += issuer ? `?issuer=${issuer}` : '';
        return this.http.getSecure(endpoint).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Street, item));
                }
                return [];
            }),
            tap((streets) => {
                this.store.dispatch(streetNgrxHelper.load({ items: streets }));
            }),
        );
    }

    getAllCities(): Observable<string[]> {
        return this.http.getSecure('street/cities').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response;
                }
                return [];
            }),
        );
    }
}
