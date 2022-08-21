import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Infringement, InfringementStatus, InfringementType } from '@modules/shared/models/entities/infringement.model';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import * as moment from 'moment';
import i18next from 'i18next';
import { AuthState, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { select, Store } from '@ngrx/store';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-create-infringement',
    templateUrl: './create-infringement.component.html',
    styleUrls: ['./create-infringement.component.less'],
})
export class CreateInfringementComponent implements OnInit, OnDestroy {
    createInfringementForm: FormGroup;
    createInfringementState: ElementStateModel<Infringement> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    @Input() vehicleId: number;
    @Input() issuerId: number;

    stepper: Stepper<FormGroup>;
    user: User;

    private destroy$ = new Subject();

    get f() {
        return this.createInfringementForm.controls;
    }

    constructor(
        private infringementService: InfringementService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private authStore: Store<AuthState>) {
        this.stepper = new Stepper<FormGroup>([
            new Step({ title: i18next.t('create-infringement.step_details'), validatorFunction: (data) => data.controls.details.valid }),
            new Step({ title: i18next.t('create-infringement.step_location'), validatorFunction: (data) => data.controls.location.valid }),
            new Step({
                title: i18next.t('create-infringement.step_document'),
                description: i18next.t('create-infringement.step_optional'),
            }),
            new Step({ title: i18next.t('create-infringement.step_confirm') }),
        ]);
    }

    ngOnInit() {
        this.createInfringementForm = this.fb.group({
            // Details
            details: new FormGroup({
                noticeNumber: new FormControl(null, Validators.required),
                caseNumber: new FormControl(null),
                brn: new FormControl(null),
                reason: new FormControl(null, []),
                reasonCode: new FormControl(null, []),
                type: new FormControl(InfringementType.Traffic, []),
                issuer: new FormControl(this.issuerId, Validators.required),
                issuerStatus: new FormControl('', Validators.required),
                issuerStatusDescription: new FormControl(''),
                vehicle: new FormControl(this.vehicleId, Validators.required),
                amountDue: new FormControl(null, Validators.required),
                originalAmount: new FormControl(null, Validators.required),
                offenceDate: new FormControl(null, Validators.required),
                latestPaymentDate: new FormControl(),
                status: new FormControl(InfringementStatus.Due, Validators.required),
                tags: new FormControl([]),
            }),
            // Location
            location: new FormGroup({
                streetName: new FormControl(null, Validators.required),
                streetNumber: new FormControl(null, Validators.required),
                city: new FormControl(null),
                country: new FormControl(null, Validators.required),
                code: new FormControl(null),
                proximity: new FormControl(null),
            }),
            // Document
            document: new FormGroup({
                documentId: new FormControl(),
            }),
        });
        this.stepper.data = this.createInfringementForm;

        const detailsForm = this.createInfringementForm.controls.details['controls'];
        detailsForm.offenceDate.valueChanges.subscribe((value) => {
            if (value && !detailsForm.latestPaymentDate.dirty) {
                detailsForm.latestPaymentDate.setValue(moment(value).add(60, 'days').toDate());
            }
        });

        this.authStore.pipe(select(currentUser), takeUntil(this.destroy$)).subscribe((user) => {
            this.user = user;
        });
    }

    get tagsAreAvailable(): boolean {
        return this.user?.type === UserType.Admin || this.user?.type === UserType.Developer;
    }

    onCreateInfringement() {
        this.createInfringementState.submit();
        const value = this.createInfringementForm.value;
        this.infringementService.createInfringement({ ...value.details, ...value.location, ...value.document }).subscribe(
            (result) => {
                this.logger.info('Successfully created Infringement', result);
                this.createInfringementState.onSuccess(i18next.t('create-infringement.success'), result);
                this.complete.emit(this.createInfringementState);
            },
            (error) => {
                this.logger.error('Failed to create Infringement', error);
                this.createInfringementState.onFailure(i18next.t('create-infringement.fail'), error.error);
                this.complete.emit(this.createInfringementState);
            },
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
