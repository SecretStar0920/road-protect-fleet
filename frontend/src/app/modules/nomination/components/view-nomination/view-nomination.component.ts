import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { nominationNgrxHelper, NominationState } from '@modules/nomination/ngrx/nomination.reducer';
import { select, Store } from '@ngrx/store';
import { Nomination, NominationStatus, NominationType } from '@modules/shared/models/entities/nomination.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { cloneDeep, isNil } from 'lodash';
import { environment } from '@environment/environment';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-view-nomination',
    templateUrl: './view-nomination.component.html',
    styleUrls: ['./view-nomination.component.less'],
})
export class ViewNominationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    nominationTypes = NominationType;

    @Input() nominationId: number;
    nomination: Nomination;

    @Output() delete: EventEmitter<ElementStateModel<Nomination>> = new EventEmitter(); // FIXME: remove, cannot delete nominations

    currency = environment.currency;
    permissions = PERMISSIONS;

    constructor(private store: Store<NominationState>, private logger: NGXLogger, private router: Router) {}

    ngOnInit() {
        this.getNomination();
    }

    getNomination() {
        this.store.dispatch(nominationNgrxHelper.getOneReq({ id: this.nominationId }));
        this.store
            .pipe(
                select(getNominationById(this.nominationId)),
                takeUntil(this.destroy$),
                tap((nomination) => {
                    if (!nomination) {
                        this.logger.debug('Nomination not found on store');
                    }
                }),
            )
            .subscribe((result) => {
                if (!isNil(result)) {
                    this.nomination = cloneDeep(result);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    isInRedirectionProcess() {
        return this.nomination.status === NominationStatus.InRedirectionProcess;
    }

    redirectionIsCompleted() {
        return this.nomination.status === NominationStatus.RedirectionCompleted;
    }

    isClosed() {
        return this.nomination.status === NominationStatus.Closed;
    }
}
