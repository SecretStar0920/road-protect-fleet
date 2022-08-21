import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, debounceTime, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as HomeReportingActions from './home-reporting.actions';
import { AccountReportingState } from '@modules/account-reporting/ngrx/account-reporting.reducer';
import { Store } from '@ngrx/store';
import { HomeReportingService } from '@modules/home/services/home-reporting.service';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';

@Injectable()
export class HomeReportingEffects {
    getHomeReportingData = createEffect(() =>
        this.actions$.pipe(
            ofType(HomeReportingActions.getHomeReportingData.request),
            debounceTime(500),
            concatMap((action) => {
                return this.homeReportingService.getHomeReportingData(action.request).pipe(
                    map((result) => HomeReportingActions.getHomeReportingData.success({ result })),
                    catchError((error) => of(HomeReportingActions.getHomeReportingData.failure({ error }))),
                );
            }),
        ),
    );

    manipulateHomeReportingData = createEffect(() =>
        this.actions$.pipe(
            ofType(HomeReportingActions.getHomeReportingData.success),
            mergeMap((action) => {
                return this.homeReportingService
                    .manipulateHomeReportingData(action.result)
                    .pipe(map((data) => HomeReportingActions.setManipulatedData({ data })));
            }),
        ),
    );

    constructor(
        private store: Store<AccountReportingState>,
        private actions$: Actions,
        private homeReportingService: HomeReportingService,
    ) {}
}
