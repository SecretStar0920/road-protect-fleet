import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { UserService } from '@modules/user/services/user.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { currentUser } from '@modules/auth/ngrx/auth.reducer';
import { takeUntil, takeWhile, tap } from 'rxjs/operators';
import { userNgrxHelper } from '@modules/user/ngrx/user.reducer';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '@modules/auth/services/auth.service';
import { ChangePasswordModalComponent } from '@modules/auth/components/change-password-modal/change-password-modal.component';

@Component({
    selector: 'rp-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.less'],
})
export class UpdateUserComponent implements OnInit, OnDestroy {
    @Input() user: User;
    @Input() userId: number;
    private destroy$ = new Subject();

    updateUserForm: FormGroup;
    updateUserState: ElementStateModel<User> = new ElementStateModel();
    resetLoginAttemptState: ElementStateModel<User> = new ElementStateModel();
    forgotPasswordRequestState: ElementStateModel<User> = new ElementStateModel<User>();
    changePasswordState: ElementStateModel<User> = new ElementStateModel<User>();
    @Output() complete: EventEmitter<ElementStateModel<User>> = new EventEmitter();

    userTypes = Object.values(UserType);
    userTypeEnum = UserType;

    changeUserPasswordModal: NzModalRef<any>;
    currentUser$: Observable<User>;
    alive = true;

    get f() {
        return this.updateUserForm.controls;
    }

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private store: Store,
        private modalService: NzModalService,
        private auth: AuthService,
    ) {}

    ngOnInit() {
        if (!this.user && !!this.userId) {
            this.getUser();
        }
        this.updateUserForm = this.fb.group({
            type: new FormControl(this.user.type, Validators.required),
            name: new FormControl(this.user.name, Validators.required),
            surname: new FormControl(this.user.surname, Validators.required),
        });

        this.currentUser$ = this.store.select(currentUser).pipe(takeWhile(() => this.alive));
    }

    getUser() {
        this.store
            .pipe(
                select(userNgrxHelper.selectEntityById(this.userId)),
                takeUntil(this.destroy$),
                tap((user) => {
                    if (!user) {
                        this.logger.debug('User not found on store, querying for it');
                        this.userService.getUser(this.userId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.user = result;
            });
    }

    onUpdateUser() {
        this.updateUserState.submit();
        this.userService
            .updateUser(this.user.userId, this.updateUserForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated user', result);
                    this.updateUserState.onSuccess(i18next.t('update-user.success'), result);
                    this.complete.emit(this.updateUserState);
                },
                (error) => {
                    this.logger.error('Failed to update user', error);
                    this.updateUserState.onFailure(i18next.t('update-user.fail'), error.error);
                    this.complete.emit(this.updateUserState);
                },
            );
    }

    onResetLoginAttempts() {
        this.resetLoginAttemptState.submit();
        this.userService
            .resetUserLoginAttempts(this.user.userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully reset user login attempts', result);
                    this.resetLoginAttemptState.onSuccess(i18next.t('reset-user-login.success'), result);
                    this.complete.emit(this.resetLoginAttemptState);
                },
                (error) => {
                    this.logger.error('Failed to reset user login attempts', error);
                    this.resetLoginAttemptState.onFailure(i18next.t('reset-user-login.fail'), error.error);
                    this.complete.emit(this.resetLoginAttemptState);
                },
            );
    }

    onChangePassword() {
        this.changeUserPasswordModal = this.modalService.create({
            nzTitle: i18next.t('view-user-advanced.edit_user'),
            nzContent: ChangePasswordModalComponent,
            nzFooter: null,
            nzComponentParams: { email: this.user.email },
        });
    }

    onSendForgotPassword() {
        this.forgotPasswordRequestState.submit();
        this.auth.forgotPassword(this.user.email).subscribe(
            (result) => {
                this.forgotPasswordRequestState.onSuccess(i18next.t('send-user-forgot-password.success', result));
                this.complete.emit(this.forgotPasswordRequestState);
            },
            (error) => {
                this.forgotPasswordRequestState.onFailure(i18next.t('send-user-forgot-password.fail'), error.message);
                this.complete.emit(this.forgotPasswordRequestState);
            },
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
