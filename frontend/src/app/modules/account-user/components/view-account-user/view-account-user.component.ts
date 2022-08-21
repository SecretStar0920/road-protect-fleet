import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { accountUserNgrxHelper, AccountUserState } from '@modules/account-user/ngrx/account-user.reducer';
import { select, Store } from '@ngrx/store';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { AccountUserService } from '@modules/account-user/services/account-user.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';

@Component({
    selector: 'rp-view-account-user',
    templateUrl: './view-account-user.component.html',
    styleUrls: ['./view-account-user.component.less'],
})
export class ViewAccountUserComponent implements OnInit, OnDestroy {
    isUpdating: boolean = false;

    @Input() accountUserId: number;
    accountUser: AccountUser;

    updateAccountUserState: ElementStateModel<AccountUser> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<AccountUser>> = new EventEmitter();

    private destroy$ = new Subject();

    permissions = PERMISSIONS;

    constructor(private store: Store<AccountUserState>, private logger: NGXLogger, private accountUserService: AccountUserService) {}

    ngOnInit() {
        this.getAccountUser();
    }

    getAccountUser() {
        this.store
            .pipe(
                select(accountUserNgrxHelper.selectEntityById(this.accountUserId)),
                takeUntil(this.destroy$),
                tap((accountUser) => {
                    if (!accountUser) {
                        this.logger.debug('Account User not found on store, querying for it');
                        this.accountUserService.getAccountUser(this.accountUserId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.accountUser = result;
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<AccountUser>) {
        this.onUpdate();
        this.updateAccountUserState = state;
    }

    onDelete(deleteState: ElementStateModel<AccountUser>) {
        this.destroy$.next();
        if (deleteState.hasSucceeded()) {
            this.delete.emit(deleteState);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
