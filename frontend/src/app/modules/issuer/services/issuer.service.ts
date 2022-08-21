import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { issuerNgrxHelper, IssuerState } from '@modules/issuer/ngrx/issuer.reducer';
import { plainToClass } from 'class-transformer';
import { CreateIssuerDto } from '@modules/issuer/services/create-issuer.dto';
import { UpdateIssuerDto } from '@modules/issuer/services/update-issuer.dto';
import { setPoliceIssuer } from '@modules/issuer/ngrx/issuer.actions';

@Injectable({
    providedIn: 'root',
})
export class IssuerService {
    constructor(private http: HttpService, private store: Store<IssuerState>) {}

    getAllIssuers() {
        return this.http.getSecure('issuer').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Issuer, item));
                }
                return [];
            }),
            tap((issuers) => {
                this.store.dispatch(issuerNgrxHelper.load({ items: issuers }));
            }),
        );
    }

    getIssuer(issuerId: number) {
        return this.http.getSecure(`issuer/${issuerId}`).pipe(
            map((response: object) => {
                return plainToClass(Issuer, response);
            }),
            tap((issuer) => {
                this.store.dispatch(issuerNgrxHelper.upsertOne({ item: issuer }));
            }),
        );
    }

    getPoliceIssuer() {
        return this.http.getSecure(`issuer/police`).pipe(
            map((response: object) => {
                return plainToClass(Issuer, response);
            }),
            tap((issuer) => {
                this.store.dispatch(setPoliceIssuer({ issuer }));
            }),
        );
    }

    createIssuer(dto: CreateIssuerDto): Observable<Issuer> {
        return this.http.postSecure('issuer', dto).pipe(
            map((response: object) => {
                return plainToClass(Issuer, response);
            }),
            tap((result) => {
                this.store.dispatch(issuerNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateIssuer(id: number, dto: UpdateIssuerDto): Observable<Issuer> {
        return this.http.postSecure(`issuer/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Issuer, response);
            }),
            tap((result) => {
                this.store.dispatch(issuerNgrxHelper.updateOne({ item: { id: result.issuerId, changes: result } }));
            }),
        );
    }

    deleteIssuer(issuerId: number) {
        return this.http.deleteSecure(`issuer/${issuerId}`).pipe(
            map((response: object) => {
                return plainToClass(Issuer, response);
            }),
            tap((issuer) => {
                this.store.dispatch(issuerNgrxHelper.deleteOne({ id: `${issuer.issuerId}` }));
            }),
        );
    }

    requestInformationFromIssuers(issuerIds: (number | string)[] = []) {
        return this.http.postSecure(`request-information-log/send-request`, { issuerIds });
    }
}
