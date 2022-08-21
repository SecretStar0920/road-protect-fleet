import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Infringement, InfringementTag } from '@modules/shared/models/entities/infringement.model';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { plainToClass } from 'class-transformer';
import { CreateInfringementDto } from '@modules/infringement/services/create-infringement.dto';
import { UpdateInfringementDto } from '@modules/infringement/services/update-infringement.dto';
import { locationNgrxHelper } from '@modules/location/ngrx/location.reducer';
import {
    BatchMunicipalRedirectionDetails,
    MunicipalRedirectionDetails,
} from '@modules/infringement/components/check-nomination-redirection-details/municipal-redirection.details';
import { RedirectMissingInfringementsResponseDto } from '@modules/infringement/services/redirect-missing-infringements-response.dto';
import { UpsertInfringementDto } from '@modules/infringement/services/upsert-infringement.dto';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';
import { BatchApproveInfringementDto } from '@modules/infringement/services/batch-approve-infringement.dto';

@Injectable({
    providedIn: 'root',
})
export class InfringementService {
    constructor(private http: HttpService, private store: Store<InfringementState>) {}

    getAllInfringements() {
        return this.http.getSecure('infringement').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Infringement, item));
                }
                return [];
            }),
            tap((infringements) => {
                this.store.dispatch(infringementNgrxHelper.load({ items: infringements }));
            }),
        );
    }

    getVehicleInfringements(vehicleId: number) {
        return this.http.getSecure(`infringement/vehicle/${vehicleId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Infringement, item));
                }
                return [];
            }),
            tap((infringements) => {
                this.store.dispatch(infringementNgrxHelper.addMany({ items: infringements }));
            }),
        );
    }

    getIssuerInfringements(issuerId: number) {
        return this.http.getSecure(`infringement/issuer/${issuerId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Infringement, item));
                }
                return [];
            }),
            tap((infringements) => {
                this.store.dispatch(infringementNgrxHelper.addMany({ items: infringements }));
            }),
        );
    }

    getAccountInfringements(accountId: number) {
        return this.http.getSecure(`infringement/account/${accountId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Infringement, item));
                }
                return [];
            }),
            tap((infringements) => {
                this.store.dispatch(infringementNgrxHelper.addMany({ items: infringements }));
            }),
        );
    }

    getInfringement(infringementId: number) {
        return this.http.getSecure(`infringement/${infringementId}`).pipe(
            map((response: object) => {
                return plainToClass(Infringement, response);
            }),
            tap((infringement) => {
                this.store.dispatch(infringementNgrxHelper.upsertOne({ item: infringement }));
            }),
        );
    }

    verifyInfringements(infringementIds: number[]) {
        return this.http.postSecure(`infringement-verification/verify`, { infringementIds });
    }

    verifyInfringement(infringementId: number) {
        return this.http.postSecure(`infringement-verification/${infringementId}/verify`, {});
    }

    redirectMissingInfringements(infringementIds: number[]) {
        return this.http
            .post(`infringement/manual-redirection/missing`, { infringementIds })
            .pipe(map((response: object) => plainToClass(RedirectMissingInfringementsResponseDto, response)));
    }

    getRedirectionDetails(infringementId: number) {
        return this.http.getSecure(`infringement/${infringementId}/redirection-readiness`).pipe(
            map((response: object) => {
                return plainToClass(MunicipalRedirectionDetails, response);
            }),
        );
    }

    getBatchRedirectionDetails(infringementIds: number[]): Observable<BatchMunicipalRedirectionDetails> {
        return this.http.postSecure(`infringement/batch/redirection-readiness`, { infringementIds }).pipe(
            map((response: object) => {
                return plainToClass(BatchMunicipalRedirectionDetails, response);
            }),
        );
    }

    createInfringement(dto: CreateInfringementDto): Observable<Infringement> {
        return this.http.postSecure('infringement', dto).pipe(
            map((response: object) => {
                return plainToClass(Infringement, response);
            }),
            tap((result) => {
                this.store.dispatch(infringementNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    updateInfringement(id: number, dto: UpdateInfringementDto): Observable<Infringement> {
        return this.http.postSecure(`infringement/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Infringement, response);
            }),
            tap((result) => {
                this.store.dispatch(infringementNgrxHelper.updateOne({ item: { id: result.infringementId, changes: result } }));
                const nomination = result.nomination;
                this.store.dispatch(nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } }));

                // View location grabs location from store so we should update it there too
                if (result.location) {
                    this.store.dispatch(
                        locationNgrxHelper.upsertOne({
                            item: result.location,
                        }),
                    );
                }
            }),
        );
    }

    updateInfringementStatus(dto: UpsertInfringementDto): Observable<Infringement> {
        return this.http.postSecure(`infringement/update-status`, dto).pipe(
            map((response) => {
                return plainToClass(Infringement, response.infringement) || response;
            }),
            tap((result) => {
                if (!!result.infringementId) {
                    this.store.dispatch(infringementNgrxHelper.updateOne({ item: { id: result.infringementId, changes: result } }));
                }
            }),
            catchError((err) => {
                return throwError(err);
            }),
        );
    }

    deleteInfringement(infringementId: number) {
        return this.http.deleteSecure(`infringement/${infringementId}`).pipe(
            map((response: object) => {
                return plainToClass(Infringement, response);
            }),
            tap((infringement) => {
                this.store.dispatch(infringementNgrxHelper.deleteOne({ id: `${infringement.infringementId}` }));
            }),
        );
    }

    approveInfringementForPayment(infringementId: number) {
        return this.http.postSecure(`infringement/${infringementId}/approve`, {}).pipe(
            map((response: object) => {
                return plainToClass(Infringement, response);
            }),
            map((infringement) => {
                return infringementNgrxHelper.updateOne({ item: { id: infringement.infringementId, changes: infringement } });
            }),
            catchError(() => EMPTY),
        );
    }

    batchApproveInfringementsForPayment(dto: BatchApproveInfringementDto) {
        return this.http.postSecure(`infringement/batch/approve`, dto).pipe(
            map((response: object[]) => {
                return plainToClass(Infringement, response);
            }),
            mergeMap((infringements: Infringement[]) => [
                infringementNgrxHelper.upsertMany({ items: infringements }),
                infringementNgrxHelper.setSelectedRowIds({ ids: [] }),
            ]),
            catchError(() => EMPTY),
        );
    }

    unapproveInfringementForPayment(infringementId: number) {
        return this.http.postSecure(`infringement/${infringementId}/unapprove`, {}).pipe(
            map((response: object) => {
                return plainToClass(Infringement, response);
            }),
            map((infringement) => {
                return infringementNgrxHelper.updateOne({ item: { id: infringement.infringementId, changes: infringement } });
            }),
            catchError(() => EMPTY),
        );
    }
}
