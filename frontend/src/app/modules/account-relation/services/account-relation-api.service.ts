import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { map, tap } from 'rxjs/operators';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { accountRelationNgrxHelper, AccountRelationState } from '@modules/account-relation/ngrx/account-relation.reducer';
import { plainToClass } from 'class-transformer';
import { CreateAccountRelationDto } from '@modules/account-relation/services/create-account-relation.dto';
import { UpdateAccountRelationDto } from '@modules/account-relation/services/update-account-relation.dto';
import { IInfringementReportOutcome } from '@modules/account/components/email-account-infringement-report/email-account-infringement-report.component';

@Injectable({
    providedIn: 'root',
})
export class AccountRelationApiService {
    constructor(private http: HttpService, private store: Store<AccountRelationState>) {}

    getAllAccountRelations() {
        return this.http.getSecure('account-relation').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountRelation, item));
                }
                return [];
            }),
            tap((accountRelations) => {
                this.store.dispatch(accountRelationNgrxHelper.load({ items: accountRelations }));
            }),
        );
    }

    getAccountRelation(accountRelationId: number) {
        return this.http.getSecure(`account-relation/${accountRelationId}`).pipe(
            map((response: object) => {
                return plainToClass(AccountRelation, response);
            }),
            tap((accountRelation) => {
                this.store.dispatch(accountRelationNgrxHelper.upsertOne({ item: accountRelation }));
            }),
        );
    }

    createAccountRelation(dto: CreateAccountRelationDto): Observable<AccountRelation> {
        return this.http.postSecure('account-relation', dto).pipe(
            map((response: object) => {
                return plainToClass(AccountRelation, response);
            }),
            tap((result) => {
                this.store.dispatch(accountRelationNgrxHelper.addOne({ item: result }));
            }),
        );
    }

    generateAccountRelationFromContracts(): Observable<AccountRelation[]> {
        return this.http.postSecure('account-relation/generate/contracts', {}).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountRelation, item));
                }
                return [];
            }),
            tap((result) => {
                this.store.dispatch(accountRelationNgrxHelper.loadPage({ items: result }));
            }),
        );
    }

    generateAccountRelationFromSpreadsheet(file: File): Observable<AccountRelation[]> {
        return this.http.uploadFile('account-relation/generate/spreadsheet', file, null).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(AccountRelation, item));
                }
                return [];
            }),
            tap((result) => {
                this.store.dispatch(accountRelationNgrxHelper.loadPage({ items: result }));
            }),
        );

    }

    updateAccountRelation(id: number, dto: UpdateAccountRelationDto): Observable<AccountRelation> {
        return this.http.postSecure(`account-relation/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(AccountRelation, response);
            }),
            tap((result) => {
                this.store.dispatch(accountRelationNgrxHelper.updateOne({ item: { id: result.accountRelationId, changes: result } }));
            }),
        );
    }

    deleteAccountRelation(accountRelationId: number) {
        return this.http.deleteSecure(`account-relation/${accountRelationId}`).pipe(
            map((response: object) => {
                return plainToClass(AccountRelation, response);
            }),
            tap((accountRelation) => {
                this.store.dispatch(accountRelationNgrxHelper.deleteOne({ id: `${accountRelation.accountRelationId}` }));
            }),
        );
    }

    sendAccountRelationInfringementReport(accountRelationId: number): Observable<IInfringementReportOutcome> {
        return this.http.post(`infringement-report/account-relation`, { accountRelationId });
    }
}
