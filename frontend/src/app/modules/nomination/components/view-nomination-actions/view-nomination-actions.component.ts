import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { cloneDeep, get, isNil, some } from 'lodash';
import { select, Store } from '@ngrx/store';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { takeUntil, tap } from 'rxjs/operators';
import { currentAccountId, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { nominationNgrxHelper, NominationState } from '@modules/nomination/ngrx/nomination.reducer';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { Nomination, NominationStatus } from '@modules/shared/models/entities/nomination.model';
import { Subject } from 'rxjs';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { AppState } from '../../../../ngrx/app.reducer';
import * as InfringementActions from '@modules/infringement/ngrx/infringement.actions';
import * as NominationReqActions from '@modules/nomination/ngrx/nomination.actions';
export enum NominationActions {
    Redirect = 'Redirect',
    GenerateDocuments = 'Generate Documents',
    Pay = 'Pay',
    Appeal = 'Appeal',
    Acknowledge = 'Acknowledge',
    UpdateRedirectionStatus = 'UpdateRedirectionStatus',
    Verify = 'Verify',
    GenerateRedirectionDocument = 'GenerateRedirectionDocument',
}

export const NOMINATION_ACTION_MAP = {
    [NominationActions.Acknowledge]: [NominationStatus.Pending, NominationStatus.RedirectionCompleted],
    [NominationActions.Redirect]: [NominationStatus.Acknowledged, NominationStatus.RedirectionCompleted],

    [NominationActions.UpdateRedirectionStatus]: [NominationStatus.InRedirectionProcess],
    [NominationActions.Appeal]: [],
    [NominationActions.Verify]: Object.values(NominationStatus as object),
};

export const OWNER_NOMINATION_ACTION_MAP = {
    [NominationActions.Redirect]: true,
};

@Component({
    selector: 'rp-view-nomination-actions',
    templateUrl: './view-nomination-actions.component.html',
    styleUrls: ['./view-nomination-actions.component.less'],
})
export class ViewNominationActionsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();

    nominationStatus = NominationStatus;
    nominationActions = NominationActions;
    currentUser: User;
    permissions = PERMISSIONS;

    private _nominationId: number;
    nomination: Nomination;
    get nominationId(): number {
        return this._nominationId;
    }

    @Input()
    set nominationId(value: number) {
        this._nominationId = value;
        if (value) {
            this.getNomination();
        }
    }

    isNominatedToCurrentAccount: boolean = false;
    isOwnedByCurrentAccount: boolean = false;

    // Modals
    showRedirectionUpdateModal: boolean = false;
    showAcknowledgmentModal: boolean = false;
    showPaymentModal: boolean = false;

    constructor(
        private store: Store<NominationState>,
        private logger: NGXLogger,
        private router: Router,
        private userStore: Store<AppState>,
    ) {}

    ngOnInit() {
        this.userStore.select(currentUser).subscribe((user) => {
            this.currentUser = user;
        });
    }

    getNomination() {
        this.store.dispatch(nominationNgrxHelper.getOneReq({ id: this._nominationId }));
        this.store
            .pipe(
                select(getNominationById(this._nominationId)),
                takeUntil(this.destroy$),
                tap((nomination) => {
                    if (!nomination) {
                        this.logger.debug('Nomination not found on store');
                    }
                }),
            )
            .subscribe((result) => {
                if (!isNil(result)) {
                    this.nomination = cloneDeep(result as Nomination);
                    this.checkIsForCurrentAccount();
                }
            });
    }

    checkIsForCurrentAccount() {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.isNominatedToCurrentAccount = get(this.nomination, 'account.accountId', 0) === accountId;
            this.isOwnedByCurrentAccount =
                this.nomination.redirectedFrom?.accountId === accountId ||
                this.nomination.infringement?.contract?.owner?.accountId === accountId;
        });
    }

    canPerformAction(action: NominationActions) {
        if (action === NominationActions.Pay) {
            //     If checking to pay need to check that the infringement status is approved for payment
            return this.nomination.infringement?.status === InfringementStatus.ApprovedForPayment;
        }

        if (action === NominationActions.Redirect && this.nomination.infringement?.status === InfringementStatus.ApprovedForPayment) {
            return false;
        }

        if (!this.isNominatedToCurrentAccount) {
            if (this.isOwnedByCurrentAccount || this.currentUser.type === UserType.Admin || this.currentUser.type === UserType.Developer) {
                return !!OWNER_NOMINATION_ACTION_MAP[action];
            } else {
                return false;
            }
        }
        const requiredStatuses = NOMINATION_ACTION_MAP[action];
        return some(requiredStatuses, (status) => status === this.nomination.status);
    }

    // Actions

    onAcknowledge() {
        this.showAcknowledgmentModal = true;
    }

    onRedirect() {
        this.router.navigate(['/home', 'nominations', this.nomination.nominationId, 'redirect', 'municipal']);
    }
    onRedirectByMail() {
        this.router.navigate(['/home', 'nominations', this.nomination.nominationId, 'redirect-by-mail', 'municipal']);
    }
    onGenerateDocumentsOnly() {
        this.router.navigate(['/home', 'nominations', this.nomination.nominationId, 'generate-documents']);
    }
    onUpdateRedirectionStatus() {
        this.showRedirectionUpdateModal = true;
    }

    onGenerateRedirectionDocument() {
       this.store.dispatch(NominationReqActions.generateRedirectionDocumentReq({ nominationId: this.nominationId }));
       // this.store.dispatch(nominationNgrxHelper.addOne({ item: this.nomination }));
   }

    onPay() {
        if(this.nomination.infringement.issuer.externalPaymentLink )
        {
            const url = this.nomination.infringement.issuer.externalPaymentLink;
            window.open(url, '_blank');
        }
        else
            this.showPaymentModal = true;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
