import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { accountRelationNgrxHelper, AccountRelationState } from '@modules/account-relation/ngrx/account-relation.reducer';
import { select, Store } from '@ngrx/store';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';

@Component({
    selector: 'rp-view-account-relation',
    templateUrl: './view-account-relation.component.html',
    styleUrls: ['./view-account-relation.component.less'],
})
export class ViewAccountRelationComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() accountRelationId: number;
    accountRelation: AccountRelation;

    updateAccountRelationState: ElementStateModel<AccountRelation> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<AccountRelation>> = new EventEmitter();

    private destroy$ = new Subject();
    permissions = PERMISSIONS;

    constructor(
        private store: Store<AccountRelationState>,
        private logger: NGXLogger,
        private accountRelationService: AccountRelationApiService,
    ) {}

    ngOnInit() {
        this.getAccountRelation();
    }

    getAccountRelation() {
        this.store
            .pipe(
                select(accountRelationNgrxHelper.selectEntityById(this.accountRelationId)),
                takeUntil(this.destroy$),
                tap((accountRelation) => {
                    if (!accountRelation) {
                        this.logger.debug('Account Relation not found on store, querying for it');
                        this.accountRelationService.getAccountRelation(this.accountRelationId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.accountRelation = result;
            });
    }

    toggleUpdating() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<AccountRelation>) {
        this.toggleUpdating();
        this.updateAccountRelationState = state;
    }

    onDelete(deleteState: ElementStateModel<AccountRelation>) {
        this.delete.emit(deleteState);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
