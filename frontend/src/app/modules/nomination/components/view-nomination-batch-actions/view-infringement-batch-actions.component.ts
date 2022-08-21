import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserType } from '@modules/shared/models/entities/user.model';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { AppState } from '../../../../ngrx/app.reducer';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { verifyInfringements } from '@modules/infringement/ngrx/infringement.actions';
import { infringementIsLoading } from '@modules/infringement/ngrx/infringement.selectors';

@Component({
    selector: 'rp-view-infringement-batch-actions',
    templateUrl: './view-infringement-batch-actions.component.html',
    styleUrls: ['./view-infringement-batch-actions.component.less'],
})
export class ViewInfringementBatchActionsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    isLoading$: Observable<boolean> = this.store.pipe(select(infringementIsLoading), takeUntil(this.destroy$));

    selectedInfringements: Infringement[] = [];
    selectedNominations: Nomination[] = [];
    userTypes = UserType;

    constructor(
        private store: Store<AppState>,
        private logger: NGXLogger,
        private router: Router,
        private infringementService: InfringementService,
    ) {}

    ngOnInit() {
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
