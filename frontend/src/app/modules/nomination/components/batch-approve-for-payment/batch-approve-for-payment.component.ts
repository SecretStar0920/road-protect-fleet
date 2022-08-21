import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { some } from 'lodash';
import { isLoading } from '@modules/nomination/ngrx/nomination.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Infringement, InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { batchApproveInfringementsReq } from '@modules/infringement/ngrx/infringement.actions';

@Component({
    selector: 'rp-batch-approve-for-payment',
    templateUrl: './batch-approve-for-payment.component.html',
    styleUrls: ['./batch-approve-for-payment.component.less'],
})
export class BatchApproveForPaymentComponent implements OnInit, OnDestroy {
    destroy$ = new Subject();
    isLoading$: Observable<boolean> = this.store.pipe(select(isLoading), takeUntil(this.destroy$));

    permissions = PERMISSIONS;

    private _infringements: Infringement[];
    get infringements(): Infringement[] {
        return this._infringements;
    }

    @Input()
    set infringements(value: Infringement[]) {
        this._infringements = value;
        this.approvableInfringements = this._infringements.filter((n) =>
            some([InfringementStatus.Due, InfringementStatus.Outstanding], (status) => status === n.status),
        );
    }

    approvableInfringements: Infringement[];

    constructor(private store: Store<AppState>) {}

    ngOnInit() {}

    batchApproveInfringements() {
        this.store.dispatch(
            batchApproveInfringementsReq({ infringementIds: this.approvableInfringements.map((row) => row.infringementId) }),
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
