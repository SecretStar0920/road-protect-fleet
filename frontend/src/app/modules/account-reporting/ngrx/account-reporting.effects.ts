import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, debounceTime, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AccountReportingActions from './account-reporting.actions';
import { AccountReportingService } from '@modules/account-reporting/services/account-reporting.service';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { select, Store } from '@ngrx/store';
import { getSelectedAccountId } from '@modules/account/ngrx/account.selectors';

@Injectable()
export class AccountReportingEffects {
    getAccountSummary = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getAccountSummary.request),
            debounceTime(500),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) => {
                return this.accountReportingService.getAccountSummaryData(currentAccountId).pipe(
                    map((result) => AccountReportingActions.getAccountSummary.success({ result: result.data })),
                    catchError((error) => of(AccountReportingActions.getAccountSummary.failure({ error }))),
                );
            }),
        ),
    );

    getVehicleCounts = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getVehicleCounts.request),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) =>
                this.accountReportingService.getVehicleCountData(currentAccountId).pipe(
                    map((result) => AccountReportingActions.getVehicleCounts.success({ result: result.data })),
                    catchError((error) => of(AccountReportingActions.getVehicleCounts.failure({ error }))),
                ),
            ),
        ),
    );

    getLeadingVehicles = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getLeadingVehicles.request),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) =>
                this.accountReportingService.getLeadingVehiclesData(currentAccountId).pipe(
                    map((result) => AccountReportingActions.getLeadingVehicles.success({ result: result.data })),
                    catchError((error) => of(AccountReportingActions.getLeadingVehicles.failure({ error }))),
                ),
            ),
        ),
    );

    getInfringementCounts = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getInfringementCounts.request),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) =>
                this.accountReportingService.getInfringementCountData(currentAccountId).pipe(
                    map((result) => AccountReportingActions.getInfringementCounts.success({ result: result.data })),
                    catchError((error) => of(AccountReportingActions.getInfringementCounts.failure({ error }))),
                ),
            ),
        ),
    );

    getInfringementAmounts = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getInfringementAmounts.request),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) =>
                this.accountReportingService.getInfringementAmountData(currentAccountId).pipe(
                    map((result) => AccountReportingActions.getInfringementAmounts.success({ result: result.data })),
                    catchError((error) => of(AccountReportingActions.getInfringementAmounts.failure({ error }))),
                ),
            ),
        ),
    );

    getMetabaseItemsDetails = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getMetabaseItemDetails.request),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) =>
                this.accountReportingService.getMetabaseReportingDetails().pipe(
                    map((result) => {
                        return AccountReportingActions.getMetabaseItemDetails.success({ result: result.data });
                    }),
                    catchError((error) => of(AccountReportingActions.getMetabaseItemDetails.failure({ error }))),
                ),
            ),
        ),
    );

    getMetabaseKPIDetails = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountReportingActions.getMetabaseKPIDetails.request),
            concatMap((action) => of(action).pipe(withLatestFrom(this.store.pipe(select(getSelectedAccountId))))),
            concatMap(([action, currentAccountId]) =>
                this.accountReportingService.getMetabaseKpiReportingDetails().pipe(
                    map((result) => {
                        return AccountReportingActions.getMetabaseKPIDetails.success({ result: result.data });
                    }),
                    catchError((error) => of(AccountReportingActions.getMetabaseKPIDetails.failure({ error }))),
                ),
            ),
        ),
    );

    constructor(
        private store: Store<AccountReportingState>,
        private actions$: Actions,
        private accountReportingService: AccountReportingService,
    ) {}
}
