import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Store } from '@ngrx/store';
import { plainToClass } from 'class-transformer';
import { map, tap } from 'rxjs/operators';
import {
    partialInfringementNgrxHelper,
    PartialInfringementState,
} from '@modules/admin-partial-infringement/ngrx/partial-infringement.reducer';
import { PartialInfringement, PartialInfringementDetails } from '@modules/shared/models/entities/partial-infringement.model';
import { Observable } from 'rxjs';
import { CreatePartialInfringementDto } from '@modules/admin-partial-infringement/services/create-partial-infringement.dto';

export class FetchPartialInfringementResponse {
    successful: PartialInfringementDetails[];
    failed: { detail: PartialInfringementDetails; error: any }[];
}
@Injectable({
    providedIn: 'root',
})
export class PartialInfringementService {
    constructor(private http: HttpService, private store: Store<PartialInfringementState>) {}

    getPartialInfringement(partialInfringementId: number) {
        return this.http.getSecure(`partial-infringement/${partialInfringementId}`).pipe(
            map((response) => {
                return plainToClass(PartialInfringement, response);
            }),
            tap((partialInfringement) => {
                if (partialInfringement) {
                    this.store.dispatch(partialInfringementNgrxHelper.upsertOne({ item: partialInfringement }));
                }
            }),
        );
    }

    createPartialInfringement(dto: CreatePartialInfringementDto): Observable<PartialInfringement> {
        return this.http.postSecure('partial-infringement', dto).pipe(
            map((response: object) => {
                return plainToClass(PartialInfringement, response);
            }),
            tap((result) => {
                this.store.dispatch(partialInfringementNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    deletePartialInfringement(partialInfringementId: number) {
        return this.http.deleteSecure(`partial-infringement/${partialInfringementId}`).pipe(
            map((response: object) => {
                return plainToClass(PartialInfringement, response);
            }),
            tap((partialInfringement) => {
                return this.store.dispatch(partialInfringementNgrxHelper.deleteOne({ id: `${partialInfringement.partialInfringementId}` }));
            }),
        );
    }

    fetchPartialInfringements(): Observable<FetchPartialInfringementResponse> {
        return this.http.getSecure(`partial-infringement/fetch`);
    }
}
