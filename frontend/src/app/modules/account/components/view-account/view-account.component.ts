import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountState } from '@modules/account/ngrx/account.reducer';
import { select, Store } from '@ngrx/store';
import { Account } from '@modules/shared/models/entities/account.model';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { AccountService } from '@modules/account/services/account.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { EMPTY, of, Subject } from 'rxjs';
import { getSelectedAccount } from '@modules/account/ngrx/account.selectors';
import { isNil } from 'lodash';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import { UserType } from '@modules/shared/models/entities/user.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import i18next from 'i18next';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-account',
    templateUrl: './view-account.component.html',
    styleUrls: ['./view-account.component.less'],
})
export class ViewAccountComponent implements OnInit, OnDestroy {
    permissions = PERMISSIONS;

    isUpdating: boolean = false;

    @Input() isCurrentAccount: boolean = false;

    account: Account;
    accountId: number;

    updateAccountState: ElementStateModel<Account> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Account>> = new EventEmitter();

    private destroy$ = new Subject();

    userTypes = UserType;

    constructor(
        private store: Store<AccountState>,
        private logger: NGXLogger,
        private accountService: AccountService,
        private modalService: NzModalService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.getAccount();
        this.route.queryParams.subscribe((queryParams) => {
            this.handlePaymentMethodUpdate(queryParams);
        });
    }

    private handlePaymentMethodUpdate(queryParams: Params) {
        let updatePaymentStatus = queryParams['update-payment-success'];
        if (!isNil(updatePaymentStatus)) {
            // Convert to boolean
            updatePaymentStatus = updatePaymentStatus === 'true';
            if (updatePaymentStatus) {
                this.modalService.success({
                    nzTitle: i18next.t('payment-method.success_title'),
                    nzContent: i18next.t('payment-method.success_description'),
                });
            } else {
                this.modalService.warning({
                    nzTitle: i18next.t('payment-method.failure_title'),
                    nzContent: i18next.t('payment-method.failure_description'),
                });
            }
            this.router.navigate([], {
                queryParams: {
                    'update-payment-success': null,
                },
                queryParamsHandling: 'merge',
            });
        }
    }

    getAccount() {
        this.logger.debug('Getting account');
        this.store
            .pipe(
                select(getSelectedAccount),
                mergeMap((result: { id: number; account: Account }) => {
                    this.accountId = result.id;
                    if (isNil(result.account)) {
                        if (result.id) {
                            return this.accountService.getAccount(result.id);
                        } else {
                            return EMPTY;
                        }
                    } else {
                        return of(result.account);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((account) => {
                this.logger.debug('Got account', account);

                this.account = account;
            });
    }

    onUpdate() {
        this.isUpdating = !this.isUpdating;
    }

    onUpdateComplete(state: ElementStateModel<Account>) {
        this.onUpdate();
        this.updateAccountState = state;
    }

    onDelete(deleteState: ElementStateModel<Account>) {
        this.destroy$.next();
        if (deleteState.hasSucceeded()) {
            this.delete.emit(deleteState);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    onPaDeletion() {
        this.accountService.getAccount(this.accountId).subscribe((result) => {
            this.account = result;
        });
    }
}
