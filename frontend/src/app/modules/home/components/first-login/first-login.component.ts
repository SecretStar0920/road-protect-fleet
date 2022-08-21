import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { User } from '@modules/shared/models/entities/user.model';
import { currentUser } from '@modules/auth/ngrx/auth.reducer';
import { isNil } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import i18next from 'i18next';
import { AuthService } from '@modules/auth/services/auth.service';
import { completeCurrentUserSignupAction } from '@modules/auth/ngrx/auth.actions';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-first-login',
    templateUrl: './first-login.component.html',
    styleUrls: ['./first-login.component.less'],
})
export class FirstLoginComponent implements OnInit, OnDestroy {
    user: User;
    showModal = false;

    firstLoginChecklist: FormGroup;

    private $destroy = new Subject();

    stepper: Stepper<FormGroup> = new Stepper<FormGroup>([
        new Step({
            title: i18next.t('first-login.step_1'),
            validatorFunction: (data) => data.controls.password.valid,
        }),
        // new Step({
        //     title: i18next.t('first-login.step_2'),
        //     validatorFunction: data => data.controls.termsAndConditions.valid,
        // }),
        new Step({
            title: i18next.t('first-login.step_3'),
        }),
    ]);

    constructor(
        private store: Store<AppState>,
        private modalService: NzModalService,
        private fb: FormBuilder,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.firstLoginChecklist = this.fb.group({
            password: new FormControl(false),
            // termsAndConditions: new FormControl(false, Validators.required), // TODO: Terms and conditions
        });

        this.store.pipe(select(currentUser), takeUntil(this.$destroy)).subscribe((user) => {
            if (!isNil(user)) {
                this.user = user;

                if (!this.user.completedSignup) {
                    this.showCompleteRegistration();
                }
            }
        });
    }

    showCompleteRegistration() {
        this.showModal = true;
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }

    toggleModal() {
        this.showModal = !this.showModal;
    }

    onChangedPassword($event: boolean) {
        this.firstLoginChecklist.controls.password.setValue($event);

        if ($event === true) {
            this.stepper.next();
        }
    }

    onCompleteProfile() {
        this.authService.completeSignup(true).subscribe(
            (result) => {
                this.showModal = false;
                this.store.dispatch(completeCurrentUserSignupAction({ isComplete: true }));
            },
            (error) => {},
        );
    }
}
