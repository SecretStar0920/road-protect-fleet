import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { batchAcknowledgeNominationReq } from '@modules/nomination/ngrx/nomination.actions';
import { Nomination, NominationStatus } from '@modules/shared/models/entities/nomination.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { some } from 'lodash';
import { isLoading } from '@modules/nomination/ngrx/nomination.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'rp-batch-acknowledge-nominations',
    templateUrl: './batch-acknowledge-nominations.component.html',
    styleUrls: ['./batch-acknowledge-nominations.component.less'],
})
export class BatchAcknowledgeNominationsComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();
    isLoading$: Observable<boolean> = this.store.pipe(select(isLoading), takeUntil(this.destroy$));

    permissions = PERMISSIONS;

    private _nominations: Nomination[];
    acknowledgeNominationForm: FormGroup;
    get nominations(): Nomination[] {
        return this._nominations;
    }

    @Input()
    set nominations(value: Nomination[]) {
        this._nominations = value;
        this.acknowledgeable = this._nominations.filter((n) => some([NominationStatus.Pending], (status) => status === n.status));
    }

    acknowledgeable: Nomination[];
    isVisible: boolean = false;

    constructor(private store: Store<AppState>, private fb: FormBuilder) {
        this.acknowledgeNominationForm = this.fb.group({
            redirection: new FormControl({ value: true, disabled: false }, Validators.required),
            appeal: new FormControl({ value: false, disabled: true }, Validators.required),
            payment: new FormControl({ value: true, disabled: true }, Validators.required),
        });
    }

    ngOnInit() {}

    batchAcknowledgeNominations() {
        this.store.dispatch(
            batchAcknowledgeNominationReq({
                nominationIds: this.acknowledgeable.map((row) => row.nominationId),
                acknowledgedFor: this.acknowledgeNominationForm.getRawValue(),
            }),
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    showModal() {
        this.isVisible = true;
    }

    onCancel() {
        this.isVisible = false;
    }
}
