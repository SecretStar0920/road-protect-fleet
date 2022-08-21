import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs/operators';
import * as actions from './nomination.actions';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';
import { LogService } from '@modules/log/services/log.service';
import { of } from 'rxjs';

@Injectable()
export class NominationEffects {
    getAllNominations$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.getManyReq),
            mergeMap(() => this.nominationService.getAllNominations()),
        );
    });

    getNominationsForAccount$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.getNominationsForAccountReq),
            mergeMap((action) => this.nominationService.getNominationsForAccount(action.accountId)),
        );
    });

    getNominationsForInfringement$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.getNominationsForInfringementReq),
            mergeMap((action) => this.nominationService.getNominationsForInfringement(action.infringementId)),
        );
    });

    getNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.getOneReq),
            mergeMap((action) => {
                return this.nominationService.getNomination(action.id);
            }),
        );
    });
    createNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.createOneReq),
            mergeMap((action) => {
                return this.nominationService.createNomination(action.dto);
            }),
        );
    });
    updateNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.updateOneReq),
            mergeMap((action) => {
                return this.nominationService.updateNomination(action.id, action.dto);
            }),
        );
    });
    deleteNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.deleteOneReq),
            mergeMap((action) => {
                return this.nominationService.deleteNomination(action.id);
            }),
        );
    });

    redirectNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.redirectNominationReq),
            mergeMap((action) => {
                return this.nominationService.digitallyRedirectNomination(action.nominationId, action.dto);
            }),
        );
    });

    batchDigitalRedirectionReq = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.batchDigitalRedirectionReq),
            mergeMap((action) => {
                return this.nominationService.batchDigitallyRedirectNominations(action);
            }),
        );
    });

    updateRedirectionStatus = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.updateRedirectionStatusReq),
            mergeMap((action) => {
                return this.nominationService.approveOrDenyRedirection(action.nominationId, action.dto);
            }),
        );
    });

    unapproveNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.unapproveNominationReq),
            mergeMap((action) => {
                return this.nominationService.unapproveNominationForPayment(action.nominationId);
            }),
        );
    });

    batchMunicipalPayNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.batchMunicipalPayNominationReq),
            mergeMap((action) => {
                return this.nominationService.batchMunicipalPayNomination(action.payableIds, action.cvvValue);
            }),
        );
    });

    batchRedirectNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.batchMunicipalRedirectNominationReq),
            mergeMap((action) => this.nominationService.batchMunicipallyRedirectNominationsReq(action.nominationsIds)),
        );
    });

    batchAcknowledgeNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.batchAcknowledgeNominationReq),
            mergeMap((action) => this.nominationService.batchAcknowledgeNominations(action)),
        );
    });

    manualPayNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.manualPayNominationReq),
            mergeMap((action) => {
                return this.nominationService.manualPayNomination(action.nominationId, action.dto);
            }),
        );
    });

    triggerInfringementRefresh = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(nominationNgrxHelper.updateOne),
                mergeMap((action) => {
                    if (!!action.item.changes.infringement?.infringementId) {
                        return this.infringementService.getInfringement(action.item.changes.infringement?.infringementId);
                    } else {
                        return of();
                    }
                }),
            );
        },
        { dispatch: false },
    );

    triggerLogsRefresh = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.updateOne),
            mergeMap((action) => {
                return this.logService.getLogsAndHistoryRefresh({
                    infringementId: action.item.changes.infringement?.infringementId,
                });
            }),
        );
    });

    municipalPayNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.municipalPayNominationReq),
            mergeMap((action) => {
                return this.nominationService.municipalPayNomination(action.nominationId, action.cvv);
            }),
        );
    });

    acknowledgeNomination = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.acknowledgeNominationReq),
            mergeMap((action) => {
                return this.nominationService.acknowledgeNomination(action.nominationId, action.dto);
            }),
        );
    });

    generateRedirectionDocument = createEffect(() => {
        return this.actions$.pipe(
            ofType(actions.generateRedirectionDocumentReq),
            mergeMap((action) => {
                return this.nominationService.generateRedirectionDocumentReq(action.nominationId);
            }),
        );
    });
    // TODO: add for all base actions
    setLoadingFalse = createEffect(() => {
        return this.actions$.pipe(
            ofType(nominationNgrxHelper.upsertMany),
            map((action) => {
                return actions.nominationLoading({ loading: false });
            }),
        );
    });

    constructor(
        private actions$: Actions,
        private nominationService: NominationService,
        private infringementService: InfringementService,
        private logService: LogService,
    ) {}
}
