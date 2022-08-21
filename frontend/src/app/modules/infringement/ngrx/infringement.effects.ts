import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actions from './infringement.actions';
import { infringementLoading } from './infringement.actions';
import { LogService } from '@modules/log/services/log.service';

@Injectable()
export class InfringementEffects {
    constructor(
        private actions$: Actions,
        private store: Store<InfringementState>,
        private http: Router,
        private infringementService: InfringementService,
        private nominationService: NominationService,
        private logService: LogService,
    ) {}
    verifyInfringements = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.verifyInfringements),
            mergeMap((action) => {
                this.store.dispatch(infringementLoading({ loading: true }));
                return this.infringementService.verifyInfringements(action.infringementIds).pipe(
                    map((result) => {
                        this.store.dispatch(infringementNgrxHelper.setSelectedRowIds({ ids: [] }));
                        return infringementLoading({ loading: false });
                    }),
                    catchError((error) => of(infringementLoading({ loading: false }))),
                );
            }),
        );
    });

    verifySingleInfringement = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.verifyInfringement),
            mergeMap((action) => {
                this.store.dispatch(infringementLoading({ loading: true }));
                return this.infringementService.verifyInfringement(action.infringementId).pipe(
                    map((verifiedInfringement) => {
                        this.store.dispatch(infringementNgrxHelper.upsertOne({ item: verifiedInfringement }));
                        return infringementLoading({ loading: false });
                    }),
                    catchError((error) => of(infringementLoading({ loading: false }))),
                );
            }),
        );
    });

    triggerNominationRefreshOnUpsert = createEffect(() => {
        return this.actions$.pipe(
            ofType(infringementNgrxHelper.upsertOne),
            mergeMap((action) => {
                return this.nominationService.getNomination(action.item.nomination.nominationId);
            }),
        );
    });

    triggerLogsRefreshOnUpsert = createEffect(() => {
        return this.actions$.pipe(
            ofType(infringementNgrxHelper.upsertOne),
            mergeMap((action) => {
                return this.logService.getLogsAndHistoryRefresh({ infringementId: action.item.infringementId });
            }),
        );
    });

    triggerNominationRefresh = createEffect(() => {
        return this.actions$.pipe(
            ofType(infringementNgrxHelper.updateOne),
            mergeMap((action) => {
                return this.nominationService.getNomination(action.item.changes.nomination?.nominationId);
            }),
        );
    });

    triggerLogsRefresh = createEffect(() => {
        return this.actions$.pipe(
            ofType(infringementNgrxHelper.updateOne),
            mergeMap((action) => {
                return this.logService.getLogsAndHistoryRefresh({ infringementId: action.item.changes.infringementId });
            }),
        );
    });

    redirectMissingInfringements = createEffect(
        () =>
            this.actions$.pipe(
                ofType(actions.redirectMissingInfringementsRequest),
                mergeMap((action) =>
                    this.infringementService.redirectMissingInfringements(action.infringementIds).pipe(
                        map((response) => actions.redirectMissingInfringementsRequestSuccess({ response })),
                        catchError((error) =>
                            of(
                                actions.redirectMissingInfringementsRequestFailed({
                                    error,
                                }),
                            ),
                        ),
                    ),
                ),
            ) as any,
    );

    approveInfringement = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.approveInfringementReq),
            mergeMap((action) => {
                return this.infringementService.approveInfringementForPayment(action.infringementId);
            }),
        );
    });

    batchApproveInfringement = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.batchApproveInfringementsReq),
            mergeMap((action) => this.infringementService.batchApproveInfringementsForPayment(action)),
        );
    });

    unapproveInfringement = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.unapproveInfringementReq),
            mergeMap((action) => {
                return this.infringementService.unapproveInfringementForPayment(action.infringementId);
            }),
        );
    });
}
