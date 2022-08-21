import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    requestComparisonSummaryIndicators,
    requestThisYearSummaryIndicators,
} from '@modules/summary-indicators/ngrx/summary-indicators.actions';
import { Injectable } from '@angular/core';
import { SummaryIndicatorsState } from '@modules/summary-indicators/ngrx/summary-indicators.reducer';
import { SummaryIndicatorsService } from '@modules/summary-indicators/services/summary-indicators.service';

@Injectable()
export class SummaryIndicatorEffects {
    constructor(
        private store: Store<SummaryIndicatorsState>,
        private actions$: Actions,
        private summaryIndicatorsService: SummaryIndicatorsService,
    ) {}

    getThisYearSummaryIndicators = createEffect(() =>
        this.actions$.pipe(
            ofType(requestThisYearSummaryIndicators.request),
            concatMap((action) =>
                this.summaryIndicatorsService.getThisYearSummaryIndicators(action.request).pipe(
                    map((result) => requestThisYearSummaryIndicators.success({ result })),
                    catchError((error) => of(requestThisYearSummaryIndicators.failure({ error }))),
                ),
            ),
        ),
    );

    getComparisonSummaryIndicators = createEffect(() =>
        this.actions$.pipe(
            ofType(requestComparisonSummaryIndicators.request),
            concatMap((action) =>
                this.summaryIndicatorsService.getComparisonSummaryIndicators(action.request).pipe(
                    map((result) => {
                        return requestComparisonSummaryIndicators.success({ result });
                    }),
                    catchError((error) => of(requestComparisonSummaryIndicators.failure({ error }))),
                ),
            ),
        ),
    );
}
