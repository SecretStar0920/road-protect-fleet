import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { infringementIsLoading } from '@modules/infringement/ngrx/infringement.selectors';
import { takeUntil } from 'rxjs/operators';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { UserType } from '@modules/shared/models/entities/user.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { isNil } from 'lodash';
import { verifyInfringements } from '@modules/infringement/ngrx/infringement.actions';

@Component({
    selector: 'rp-admin-batch-actions',
    templateUrl: './admin-batch-actions.component.html',
    styleUrls: ['./admin-batch-actions.component.less'],
})
export class AdminBatchActionsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    isLoading$: Observable<boolean> = this.store.pipe(select(infringementIsLoading), takeUntil(this.destroy$));

    selectedInfringements: Infringement[] = [];
    selectedNominations: Nomination[] = [];
    userTypes = UserType;

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.pipe(select(infringementNgrxHelper.selectCurrentlySelectedRowData(), takeUntil(this.destroy$))).subscribe((result) => {
            this.selectedInfringements = result;
        });
        this.store.pipe(select(infringementNgrxHelper.selectCurrentlySelectedRowData(), takeUntil(this.destroy$))).subscribe((result) => {
            this.selectedInfringements = result;
            this.selectedNominations = this.selectedInfringements.filter((inf) => !isNil(inf.nomination)).map((inf) => inf.nomination);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onVerify() {
        const infringementIds = this.selectedInfringements.map((a) => a.infringementId);
        this.store.dispatch(verifyInfringements({ infringementIds }));
    }
}
