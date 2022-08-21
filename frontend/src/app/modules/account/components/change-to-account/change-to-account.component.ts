import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { select, Store } from '@ngrx/store';
import { AuthState, currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { AuthService } from '@modules/auth/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { UserType } from '@modules/shared/models/entities/user.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-change-to-account',
    templateUrl: './change-to-account.component.html',
    styleUrls: ['./change-to-account.component.less'],
})
export class ChangeToAccountComponent implements OnInit, OnDestroy {
    currentAccountId: number;
    @Input() targetAccountId: number;
    private destroy$ = new Subject();

    changeAccountState: ElementStateModel = new ElementStateModel();

    @Output() changeAccountComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
    changeAccountVisible: boolean;

    userTypes = UserType;

    constructor(
        private store: Store<AuthState>,
        private authService: AuthService,
        private modalService: NzModalService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((account) => {
            this.currentAccountId = account;
        });
    }

    onChangeAccount() {
        this.changeAccountState.submit();
        this.authService.changeAccount(this.targetAccountId).subscribe(
            (result) => {
                this.changeAccountState.onSuccess(i18next.t('change-to-account.success'), result);
                this.changeAccountVisible = false;
                this.changeAccountComplete.emit(true);
                this.showChangeViewModal();
            },
            (error) => {
                this.changeAccountState.onFailure(i18next.t('change-to-account.fail'), error);
                this.changeAccountVisible = true;
                this.changeAccountComplete.emit(false);
            },
        );
    }

    private showChangeViewModal() {
        // this.modalService.confirm({
        //     nzOnOk: () => this.router.navigate(['/home', 'account', 'profile']),
        //     nzTitle: i18next.t('change-to-account.success_confirm'),
        // });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
