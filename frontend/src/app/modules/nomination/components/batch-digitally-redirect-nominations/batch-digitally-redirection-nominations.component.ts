import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { batchDigitalRedirectionReq } from '@modules/nomination/ngrx/nomination.actions';
import { Nomination, NominationStatus } from '@modules/shared/models/entities/nomination.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { some } from 'lodash';
import { getBatchDigitalRedirectionResultData, isLoading } from '@modules/nomination/ngrx/nomination.selectors';
import { Observable, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NominationTarget } from '@modules/shared/models/entities/vehicle.model';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

export class IBatchDigitalRedirectionsResult {
    successfulRedirections: Nomination[];
    failedRedirections: Nomination[];
}

@Component({
    selector: 'rp-batch-digitally-redirect-nominations',
    templateUrl: './batch-digitally-redirection-nominations.component.html',
    styleUrls: ['./batch-digitally-redirection-nominations.component.less'],
})
export class BatchDigitallyRedirectionNominationsComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();
    isLoading$: Observable<boolean> = this.store.pipe(select(isLoading), takeUntil(this.destroy$));
    batchDigitalRedirectLoadingState = new ElementStateModel();

    batchRedirectionResult: IBatchDigitalRedirectionsResult;

    permissions = PERMISSIONS;
    nominationTarget = NominationTarget;

    private _nominations: Nomination[];
    get nominations(): Nomination[] {
        return this._nominations;
    }

    @Input()
    set nominations(value: Nomination[]) {
        this._nominations = value;
        this.redirectableNominations = this._nominations
            .filter((n) => some([NominationStatus.Acknowledged], (status) => status === n.status))
            .filter((n) => n.details.acknowledgedFor.redirection);
    }

    redirectableNominations: Nomination[] = [];

    form: FormGroup;
    isVisible: boolean = false;

    constructor(private store: Store<AppState>, private fb: FormBuilder) {
        this.form = fb.group({
            to: new FormControl(NominationTarget.Owner, Validators.required),
        });
    }

    ngOnInit() {}

    batchRedirect() {
        this.isVisible = true;
    }

    batchRedirectConfirm() {
        this.batchDigitalRedirectLoadingState.submit();
        this.store.dispatch(
            batchDigitalRedirectionReq({
                nominationIds: this.redirectableNominations.map((row) => row.nominationId),
                to: this.form.value.to,
            }),
        );

        this.store.pipe(select(getBatchDigitalRedirectionResultData), skip(1), takeUntil(this.destroy$)).subscribe(
            (result) => {
                this.batchDigitalRedirectLoadingState.onSuccess();
                this.batchRedirectionResult = result;
            },
            (error) => {
                this.batchDigitalRedirectLoadingState.onFailure(error.message);
            },
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onCancel() {
        this.batchRedirectionResult = undefined;
        this.isVisible = false;
    }
}
