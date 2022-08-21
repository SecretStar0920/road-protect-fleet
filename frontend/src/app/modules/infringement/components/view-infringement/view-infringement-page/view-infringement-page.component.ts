import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { AppState } from '../../../../../ngrx/app.reducer';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { Infringement, InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import * as InfringementActions from '@modules/infringement/ngrx/infringement.actions';
import { isNil } from 'lodash';

@Component({
    selector: 'rp-view-infringement-page',
    templateUrl: './view-infringement-page.component.html',
    styleUrls: ['./view-infringement-page.component.less'],
})
export class ViewInfringementPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    permissions = PERMISSIONS;

    infringementId: number;
    showApproveForPayment: boolean;
    showUnapproveForPayment: boolean;
    infringement: Infringement;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private logger: NGXLogger,
        private infringementService: InfringementService,
    ) {
        this.getInfringementIdFromParam();
    }

    ngOnInit() {}

    getInfringementIdFromParam() {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            this.infringementId = Number(params.id);
            this.getInfringement();
        });
    }

    getInfringement() {
        this.store
            .pipe(
                select(infringementNgrxHelper.selectEntityById(this.infringementId)),
                takeUntil(this.destroy$),
                tap((infringement) => {
                    if (!infringement) {
                        this.logger.debug('Infringement not found on store, querying for it');
                        this.infringementService.getInfringement(this.infringementId).pipe(takeUntil(this.destroy$)).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.infringement = result;

                if (!isNil(result)) {
                    this.showApproveForPayment =
                        result.status === InfringementStatus.Due || result.status === InfringementStatus.Outstanding;
                    this.showUnapproveForPayment = result.status === InfringementStatus.ApprovedForPayment;
                }
            });
    }

    onDelete() {
        this.router.navigate(['/home', 'infringements']);
    }

    onApprove() {
        this.store.dispatch(InfringementActions.approveInfringementReq({ infringementId: this.infringementId }));
    }

    onUnapprove() {
        this.store.dispatch(InfringementActions.unapproveInfringementReq({ infringementId: this.infringementId }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
