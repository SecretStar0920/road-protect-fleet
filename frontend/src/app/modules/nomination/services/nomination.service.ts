import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Store } from '@ngrx/store';
import { nominationNgrxHelper, NominationState } from '@modules/nomination/ngrx/nomination.reducer';
import { plainToClass } from 'class-transformer';
import { CreateNominationDto } from '@modules/nomination/services/create-nomination.dto';
import { UpdateNominationDto } from '@modules/nomination/services/update-nomination.dto';
import { EMPTY } from 'rxjs';
import { DigitalRedirectionDto } from '@modules/nomination/services/digital-redirection.dto';
import { ManualPayNominationDto } from '@modules/nomination/services/manual-pay-nomination.dto';
import { BatchApproveNominationDto } from '@modules/nomination/services/batch-approve-nomination.dto';
import { BatchDigitallyRedirectNominationDto } from '@modules/nomination/services/batch-digitally-redirect-nomination.dto';
import { AcknowledgeNominationDto } from '@modules/nomination/services/acknowledge-nomination.dto';
import { BatchAcknowledgeNominationDto } from '@modules/nomination/services/batch-acknowledge-nomination.dto';
import { UpdateRedirectionStatusDto } from '@modules/nomination/services/update-redirection-status.dto';
import { CreditGuardIntegrationType } from '@modules/payment/services/payment-method.service';
import { cloneDeep } from 'lodash';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { IBatchRedirectionsResult } from '@modules/nomination/components/batch-municipally-redirect-nominations/batch-municipally-redirection-nominations.component';
import {
    batchDigitalRedirectionNominationReqSuccess,
    batchMunicipalPayNominationReqSuccess,
    batchMunicipalRedirectNominationReqSuccess,
} from '@modules/nomination/ngrx/nomination.actions';
import { IBatchDigitalRedirectionsResult } from '@modules/nomination/components/batch-digitally-redirect-nominations/batch-digitally-redirection-nominations.component';

export enum PaymentFlow {
    None = 'None',
    RpTwoPhase = 'RpTwoPhase',
    AtgDirect = 'AtgDirect',
}

export interface IPaymentFlowDetail {
    description: string;
    id: PaymentFlow;
    requiredPaymentMethods: CreditGuardIntegrationType[];
}

export class IBatchPaymentResult {
    successful: Nomination[];
    failed: { error: any; nomination: Nomination }[];
}

export const PAYMENT_FLOW_DETAILS: { [key: string]: IPaymentFlowDetail } = {
    [PaymentFlow.None]: { description: 'No supported payment integration', id: PaymentFlow.None, requiredPaymentMethods: [] },
    [PaymentFlow.RpTwoPhase]: {
        description: 'Road Protect Payment Portal',
        id: PaymentFlow.RpTwoPhase,
        requiredPaymentMethods: [CreditGuardIntegrationType.RP],
    },
    [PaymentFlow.AtgDirect]: {
        description: 'Direct Automation Payment Portal',
        id: PaymentFlow.AtgDirect,
        requiredPaymentMethods: [CreditGuardIntegrationType.ATG],
    },
};

@Injectable({
    providedIn: 'root',
})
export class NominationService {
    constructor(private http: HttpService, private store: Store<NominationState>) {}

    getAllNominations() {
        return this.http.getSecure('nomination').pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Nomination, item));
                }
                return [];
            }),
            map((nominations) => {
                return nominationNgrxHelper.load({ items: nominations });
            }),
            catchError(() => EMPTY),
        );
    }

    getNominationsForAccount(accountId: number) {
        return this.http.getSecure(`nomination/account/${accountId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Nomination, item));
                }
                return [];
            }),
            map((nominations) => {
                return nominationNgrxHelper.addMany({ items: nominations });
            }),
            catchError(() => EMPTY),
        );
    }

    getNominationsForInfringement(infringementId: number) {
        return this.http.getSecure(`nomination/infringement/${infringementId}`).pipe(
            map((response) => {
                if (response.length && response.length >= 0) {
                    return response.map((item) => plainToClass(Nomination, item));
                }
                return [];
            }),
            map((nominations) => {
                return nominationNgrxHelper.addMany({ items: nominations });
            }),
            catchError(() => EMPTY),
        );
    }

    getNomination(nominationId: number) {
        return this.http.getSecure(`nomination/${nominationId}`).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.upsertOne({ item: nomination });
            }),
            catchError(() => EMPTY),
        );
    }

    createNomination(dto: CreateNominationDto) {
        return this.http.postSecure('nomination', dto).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((result) => {
                return nominationNgrxHelper.addOne({ item: result });
            }),
            catchError(() => EMPTY),
        );
    }

    updateNomination(id: number, dto: UpdateNominationDto) {
        return this.http.postSecure(`nomination/${id}`, dto).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((result) => {
                return nominationNgrxHelper.updateOne({ item: { id: result.nominationId, changes: result } });
            }),
            catchError(() => EMPTY),
        );
    }

    deleteNomination(nominationId: number) {
        return this.http.deleteSecure(`nomination/${nominationId}`).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.deleteOne({ id: `${nomination.nominationId}` });
            }),
            catchError(() => EMPTY),
        );
    }

    digitallyRedirectNomination(nominationId: number, dto: DigitalRedirectionDto) {
        return this.http.postSecure(`nomination/${nominationId}/redirect/digital`, dto).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } });
            }),
            catchError(() => EMPTY),
        );
    }

    municipallyRedirectNomination(nominationId: number) {
        return this.municipallyRedirectNominationReq(nominationId).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.updateOne({ item: { id: nominationId, changes: nomination } });
            }),
            catchError(() => EMPTY),
        );
    }

    municipallyRedirectNominationReq(nominationId: number) {
        return this.http.postSecure(`nomination/${nominationId}/redirect/municipal`, {});
    }

    batchMunicipallyRedirectNominationsReq(nominationIds: number[]) {
        return this.http.postSecure(`nomination/batch/redirect/municipal`, { nominationIds }).pipe(
            tap((result) => {
                const batchResult = plainToClass(IBatchRedirectionsResult, result);
                const nominations: Nomination[] = batchResult.successfulRedirections.map((s) => {
                    return s.result;
                });
                this.store.dispatch(nominationNgrxHelper.upsertMany({ items: nominations }));
                this.store.dispatch(infringementNgrxHelper.setSelectedRowIds({ ids: [] }));
                this.store.dispatch(
                    infringementNgrxHelper.upsertMany({
                        items: nominations.map((n) => {
                            const infringement = cloneDeep(n.infringement);
                            infringement.nomination = cloneDeep(n);
                            return infringement;
                        }),
                    }),
                );
            }),
            map((response) => {
                return batchMunicipalRedirectNominationReqSuccess({ result: response });
            }),
            catchError(() => EMPTY),
        );
    }

    approveOrDenyRedirection(nominationId: number, dto: UpdateRedirectionStatusDto) {
        return this.approveOrDenyRedirectionReq(nominationId, dto).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.updateOne({ item: { id: nominationId, changes: nomination } });
            }),
            catchError(() => EMPTY),
        );
    }

    approveOrDenyRedirectionReq(nominationId: number, dto: UpdateRedirectionStatusDto) {
        return this.http.postSecure(`nomination/${nominationId}/redirect/approve`, dto);
    }

    unapproveNominationForPayment(nominationId: number) {
        return this.http.postSecure(`nomination/${nominationId}/unapprove`, {}).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } });
            }),
            catchError(() => EMPTY),
        );
    }


    generateRedirectionDocumentReq(nominationId: number) {
        return this.http.postSecure(`nomination/${nominationId}/generate-redirection-document`, {}).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } });
            }),
            catchError(() => EMPTY),
        );
    }
    

    batchDigitallyRedirectNominations(dto: BatchDigitallyRedirectNominationDto) {
        return this.http.postSecure(`nomination/batch/redirect/digital`, dto).pipe(
            tap((result) => {
                const batchResult = plainToClass(IBatchDigitalRedirectionsResult, result);
                const nominations: Nomination[] = batchResult.successfulRedirections;
                this.store.dispatch(nominationNgrxHelper.upsertMany({ items: nominations }));
                this.store.dispatch(
                    infringementNgrxHelper.upsertMany({
                        items: nominations.map((n) => {
                            const infringement = cloneDeep(n.infringement);
                            infringement.nomination = cloneDeep(n);
                            return infringement;
                        }),
                    }),
                );
                this.store.dispatch(infringementNgrxHelper.setSelectedRowIds({ ids: [] }));
            }),
            map((response) => {
                return batchDigitalRedirectionNominationReqSuccess({ result: response });
            }),
            catchError(() => EMPTY),
        );
    }

    batchAcknowledgeNominations(dto: BatchAcknowledgeNominationDto) {
        return this.http.postSecure(`nomination/batch/acknowledge`, dto).pipe(
            map((response: object[]) => {
                return plainToClass(Nomination, response);
            }),
            map((nominations) => {
                return nominationNgrxHelper.upsertMany({ items: nominations });
            }),
            catchError(() => EMPTY),
        );
    }

    manualPayNomination(nominationId: number, dto: ManualPayNominationDto) {
        return this.http.postSecure(`payment/nomination/${nominationId}/manual`, dto).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            tap((nomination) => {
                this.store.dispatch(nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } }));
            }),
            catchError(() => EMPTY),
        );
    }

    // FIXME: cleanup by moving the payment methods to payment service and using store
    getNominationPaymentDetails(nominationId: number) {
        return this.http.getSecure(`payment/nomination/${nominationId}/details`);
    }

    getNominationPaymentDetailsBatch(nominationIds: number[]) {
        return this.http.postSecure(`payment/nomination/batch/details`, { nominationIds });
    }

    // It was too complicated to use the full NGRX facade for this
    // This function is called and subscribed to
    municipalPayNomination(nominationId: number, cvv: any) {
        return this.http.postSecure(`payment/nomination/${nominationId}/municipal`, { cvv }).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            tap((nomination) => {
                this.store.dispatch(nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } }));
            }),
        );
    }

    batchMunicipalPayNomination(nominationIds: number[], cvv: any) {
        return this.http.postSecure(`payment/nomination/batch/municipal`, { nominationIds, cvv }).pipe(
            map((response: IBatchPaymentResult) => {
                const nominations = plainToClass(Nomination, response.successful);
                return { successful: nominations, failed: response.failed };
            }),
            mergeMap((data: IBatchPaymentResult) => [
                nominationNgrxHelper.upsertMany({ items: data.successful }),
                infringementNgrxHelper.updateMany({
                    items: data.successful.map((n) => {
                        const infringement = cloneDeep(n.infringement);
                        infringement.nomination = cloneDeep(n);
                        return { id: infringement.infringementId, changes: infringement };
                    }),
                }),
                batchMunicipalPayNominationReqSuccess({ result: data }),
                infringementNgrxHelper.setSelectedRowIds({ ids: [] }),
            ]),
            catchError(() => EMPTY),
        );
    }

    acknowledgeNomination(nominationId: number, dto: AcknowledgeNominationDto) {
        return this.http.postSecure(`nomination/${nominationId}/acknowledge`, dto).pipe(
            map((response: object) => {
                return plainToClass(Nomination, response);
            }),
            map((nomination) => {
                return nominationNgrxHelper.updateOne({ item: { id: nomination.nominationId, changes: nomination } });
            }),
            catchError(() => EMPTY),
        );
    }
}
