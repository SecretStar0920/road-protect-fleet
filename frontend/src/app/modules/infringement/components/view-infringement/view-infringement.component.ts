import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { environment } from '@environment/environment';
import { ManualUpdateStatusComponent } from '@modules/infringement/components/manual-update-status/manual-update-status.component';
import { verifyInfringement } from '@modules/infringement/ngrx/infringement.actions';
import { infringementNgrxHelper, InfringementState } from '@modules/infringement/ngrx/infringement.reducer';
import { infringementIsLoading } from '@modules/infringement/ngrx/infringement.selectors';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { NominationStatus, NominationType } from '@modules/shared/models/entities/nomination.model';
import { UserType } from '@modules/shared/models/entities/user.model';
import { select, Store } from '@ngrx/store';
import i18next from 'i18next';
import { get } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'rp-view-infringement',
    templateUrl: './view-infringement.component.html',
    styleUrls: ['./view-infringement.component.less'],
})
export class ViewInfringementComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();

    userTypes = UserType;

    isUpdating: boolean = false;
    @Input() infringementId: number;

    infringement: Infringement;
    updateInfringementState: ElementStateModel<Infringement> = new ElementStateModel();
    isLoading$: Observable<boolean> = this.store.pipe(select(infringementIsLoading), takeUntil(this.destroy$));

    @Output() delete: EventEmitter<ElementStateModel<Infringement>> = new EventEmitter();

    currency = environment.currency;
    permission = PERMISSIONS;

    updateStatusesModal: NzModalRef<any>;

    constructor(
        private store: Store<InfringementState>,
        private logger: NGXLogger,
        private infringementService: InfringementService,
        private modalService: NzModalService,
    ) {}

    ngOnInit() {
        this.getInfringement();
    }

    getInfringement() {
        this.store
            .pipe(
                select(infringementNgrxHelper.selectEntityById(this.infringementId)),
                takeUntil(this.destroy$),
                tap((infringement) => {
                    if (!infringement) {
                        this.logger.debug('Infringement not found on store, querying for it');
                        this.infringementService.getInfringement(this.infringementId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.infringement = result;
            });
    }

    getTotalPayment() {
        if (!this.infringement.payments) {
            return '0';
        } else {
            const total = this.infringement.payments.reduce((sum, current) => sum + +current.amountPaid, 0);
            return total;
        }
    }

    findRecentPayment() {
        if (!this.infringement.payments) {
            return;
        }
        return this.infringement.payments.reduce((a, b) => {
            return moment(a.paymentDate).isAfter(moment(b.paymentDate)) ? a : b;
        });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateStatus() {
        this.updateStatusesModal = this.modalService.create({
            nzTitle: i18next.t('edit-status.edit_status'),
            nzContent: ManualUpdateStatusComponent,
            nzFooter: null,
            nzComponentParams: { infringement: this.infringement },
        });
    }

    onUpdateComplete(state: ElementStateModel<Infringement>) {
        this.onUpdate();
        this.updateInfringementState = state;
    }

    onDelete(deleteState: ElementStateModel<Infringement>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    onVerify() {
        this.store.dispatch(verifyInfringement({ infringementId: this.infringementId }));
    }

    canManuallyChangeStatus() {
        const statusesThatCanUpdate = [
            NominationStatus.RedirectionCompleted,
            NominationStatus.InRedirectionProcess,
            NominationStatus.Acknowledged,
        ];
        const currentNominationStatus = get(this.infringement, 'nomination.status');
        return !this.isUpdating && statusesThatCanUpdate.includes(currentNominationStatus);
    }

    getNominationHeading(): string {
        if (
            this.infringement.nomination?.status === NominationStatus.RedirectionCompleted ||
            this.infringement.nomination?.status === NominationStatus.InRedirectionProcess
        ) {
            return 'view-infringement.redirection';
        } else if (this.infringement.nomination?.type === NominationType.Digital) {
            return 'view-infringement.nominated_by_contract';
        } else {
            return 'view-infringement.nomination';
        }
    }
}
