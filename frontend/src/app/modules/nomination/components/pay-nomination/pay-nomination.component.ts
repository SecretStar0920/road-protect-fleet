import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import i18next from 'i18next';
import { IPaymentFlowDetail, NominationService } from '@modules/nomination/services/nomination.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { infringementIsLoading } from '@modules/infringement/ngrx/infringement.selectors';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { verifyInfringement } from '@modules/infringement/ngrx/infringement.actions';
import * as moment from 'moment';
import { isNil } from 'ng-zorro-antd/core/util';

export class PayInfringementDetails {
    canBePaid: boolean;
    message?: string;
    // Base details
    infringementId: number;
    nominationId: number;
    amountDue: string;
    // Issuer based
    isATG: boolean;
    isPCI: boolean;
    paymentFlow: IPaymentFlowDetail;
    additional?: any;
    // Account based
    hasAllRequiredPaymentMethods: boolean;
    missingPaymentMethods: string[] = [];
    requiredPaymentMethods: string[] = [];
    hasPaymentMethods: { method: string; cardMask: string }[] = [];
    paymentMethodsToBeUsed: { method: string; cardMask: string }[] = [];
}

@Component({
    selector: 'rp-pay-nomination',
    templateUrl: './pay-nomination.component.html',
    styleUrls: ['./pay-nomination.component.less'],
})
export class PayNominationComponent implements OnInit, OnDestroy {
    method: 'parent' | 'manual' | 'auto' = 'parent';

    parentStepper = new Stepper([new Step({ title: 'Method' }), new Step({ title: 'Result' })]);
    cvvForm = new FormGroup({});

    manualStepper = new Stepper<FormGroup>([
        new Step({
            title: i18next.t('pay-nomination.step_proof'),
            description: i18next.t('pay-nomination.step_optional'),
            validatorFunction: (data) => data.valid,
        }),
        new Step({ title: i18next.t('pay-nomination.confirm') }),
        new Step({ title: 'Result' }),
    ]);
    manualForm: FormGroup;

    autoStepper = new Stepper([]);

    paymentDetails: PayInfringementDetails;
    private destroy$ = new Subject();
    private paymentVerificationHours = 6;

    @Output() close: EventEmitter<boolean> = new EventEmitter();
    @Input() nomination: Nomination;

    payNominationState = new ElementStateModel();
    isVerifying$: Observable<boolean> = this.store.pipe(select(infringementIsLoading), takeUntil(this.destroy$));
    isPaid$ = new Subject<boolean>();

    constructor(private fb: FormBuilder, private store: Store<AppState>, private nominationService: NominationService) {
        this.manualForm = this.fb.group({
            documentId: new FormControl(),
            additional: new FormControl(),
            referenceNumber: new FormControl(null, Validators.required),
            amountPaid: new FormControl(),
        });
        this.manualStepper.data = this.manualForm;
    }

    private configureCvvForm() {
        this.cvvForm = new FormGroup({});
        this.paymentDetails.paymentMethodsToBeUsed.forEach((method) => {
            this.cvvForm.addControl(method.method, new FormControl('', Validators.required));
        });
    }

    ngOnInit() {
        // // FIXME: very hacky way of checking if it was updated
        // this.store.pipe(select(getNominationById(this.nomination.nominationId)), skip(1)).subscribe((result) => {
        //     this.close.emit(true);
        // });

        // Get payment details about this "nomination"
        // Such as whether it can be paid via integration and if the payment details exist on the account to be able to do it
        this.getNominationPaymentDetails();
        this.isPaid$.pipe(takeUntil(this.destroy$)).subscribe();
        this.isVerifying$.pipe(takeUntil(this.destroy$)).subscribe((isVerifying) => {
            // Checks if the infringement has been paid after verification
            if (!isVerifying) {
                this.updateNomination();
            }
        });
    }

    getNominationPaymentDetails() {
        this.nominationService
            .getNominationPaymentDetails(this.nomination.nominationId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.paymentDetails = data;
                this.configureCvvForm();
            });
    }

    updateNomination() {
        this.store.pipe(select(getNominationById(this.nomination.nominationId)), takeUntil(this.destroy$)).subscribe((nomination) => {
            if (!isNil(nomination)) {
                this.isPaid$.next(nomination.infringement.status === InfringementStatus.Paid);
            }
        });
        // Refresh form, if nomination has not been paid, the payment can now be made
        this.getNominationPaymentDetails();
    }

    toManual() {
        this.method = 'manual';
    }

    onConfirmManual() {
        const dto = {
            details: {
                additional: this.manualForm.value.additional,
            },
            documentId: this.manualForm.value.documentId,
            referenceNumber: this.manualForm.value.referenceNumber,
            amountPaid: this.manualForm.value.amountPaid,
        };

        this.payNominationState.submit();
        this.nominationService
            .manualPayNomination(this.nomination.nominationId, dto)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.payNominationState.onSuccess();
                    this.manualStepper.next();
                },
                (error) => {
                    this.payNominationState.onFailure(error.error.message);
                    this.manualStepper.next();
                },
            );
    }

    notRecentlyVerified(): boolean {
        if (!this.nomination.infringement.externalChangeDate) {
            return false;
        }
        return moment(this.nomination.infringement.externalChangeDate).isBefore(moment().subtract(this.paymentVerificationHours, 'hours'));
    }

    onVerify() {
        // Verify infringement if it is being paid by crawlers
        this.store.dispatch(verifyInfringement({ infringementId: this.nomination.infringement.infringementId }));
    }

    onPayNow() {
        this.payNominationState.submit();
        this.nominationService
            .municipalPayNomination(this.nomination.nominationId, this.cvvForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.payNominationState.onSuccess();
                    this.parentStepper.next();
                },
                (error) => {
                    this.payNominationState.onFailure(error.error.message);
                    this.parentStepper.next();
                },
            );
    }

    onCloseModal() {
        this.close.emit(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
