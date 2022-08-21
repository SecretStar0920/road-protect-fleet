import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { LeaseContractService } from '@modules/contract/modules/lease-contract/services/lease-contract.service';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import i18next from 'i18next';
import { Document } from '@modules/shared/models/entities/document.model';
import * as moment from 'moment';
import { select, Store } from '@ngrx/store';
import { AccountState } from '@modules/account/ngrx/account.reducer';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import * as accountSelectors from '@modules/account/ngrx/account.selectors';
import { AccountService } from '@modules/account/services/account.service';
import { Account } from '@modules/shared/models/entities/account.model';
import { LeaseContractOcrService } from '@modules/contract/modules/lease-contract/services/lease-contract-ocr.service';
import { OcrDto } from '@modules/contract/modules/lease-contract/services/ocr.dto';

@Component({
    selector: 'rp-create-lease-contract',
    templateUrl: './create-lease-contract.component.html',
    styleUrls: ['./create-lease-contract.component.less'],
})
export class CreateLeaseContractComponent implements OnInit, OnDestroy {
    @Input() vehicleId: number;
    performOCR: boolean = true; // Should OCR be performed?

    createContractForm: FormGroup;
    createContractState: ElementStateModel<Contract> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();
    @Output() ocrError: EventEmitter<string[]> = new EventEmitter();
    document: Document;
    ownerAccount: Account;
    userAccount: Account;
    ocrFail: boolean = false;
    ocrCompleted: boolean = false;
    ocrErrorMessage: string[] = [''];

    mimeTypes = MIME_TYPES;
    private $destroy = new Subject();

    stepper: Stepper<FormGroup> = new Stepper<FormGroup>([
        new Step({ title: i18next.t('create-contract.document'), validatorFunction: (data) => data.controls.document.valid }),
        new Step({ title: i18next.t('create-contract.details'), validatorFunction: (data) => data.controls.details.valid }),
        new Step({ title: i18next.t('create-contract.create') }),
    ]);

    get f() {
        return this.createContractForm.controls;
    }

    constructor(
        private leaseContractService: LeaseContractService,
        private store: Store<AccountState>,
        private accountService: AccountService,
        private leaseContractOcrService: LeaseContractOcrService,
        private fb: FormBuilder,
        private logger: NGXLogger,
    ) {}

    ngOnInit() {
        this.createContractForm = this.fb.group({
            details: new FormGroup({
                startDate: new FormControl(null, [Validators.required]),
                endDate: new FormControl(null, Validators.required),
                vehicle: new FormControl(this.vehicleId, Validators.required),
                owner: new FormControl(null, Validators.required),
                user: new FormControl(null, Validators.required),
                reference: new FormControl(null),
            }),
            document: new FormGroup({
                document: new FormControl(null),
            }),
        });

        this.stepper.data = this.createContractForm;
    }

    onOcrCompletion(document: Document) {
        this.document = document;

        // Get accounts for owner and user
        this.ownerAccount = this.getAccountByIdentifier(this.document.ocr.owner);
        if (this.ownerAccount) {
            this.createContractForm.patchValue({
                details: {
                    owner: this.ownerAccount.accountId,
                },
            });
        }

        this.userAccount = this.getAccountByIdentifier(this.document.ocr.customer);
        if (this.userAccount) {
            this.createContractForm.patchValue({
                details: {
                    user: this.userAccount.accountId,
                },
            });
        }

        // Update dates and vehicle
        this.createContractForm.patchValue({
            details: {
                startDate: moment(this.document.ocr.start).endOf('day').toDate(),
                endDate: moment(this.document.ocr.end).endOf('day').toDate(),
                vehicle: this.document.ocr.car,
            },
        });

        this.ocrCompleted = true;
    }

    getAccountByIdentifier(identifier: string): Account {
        let account: Account;
        this.store
            .pipe(
                select(accountSelectors.getAccountByIdentifier(identifier)),
                takeUntil(this.$destroy),
                tap((accounts) => {
                    if (!accounts || accounts.length < 1) {
                        this.logger.debug('Owner account not found on store, querying for it');
                        this.accountService.getAccountByIdentity(identifier).subscribe();
                    }
                }),
            )
            .subscribe(
                (result) => {
                    account = result[0];
                },
                (error) => {
                    this.logger.debug('Account does not exist', error);
                },
            );
        return account;
    }

    compareToOcr(contractValues) {
        const contractOCR: OcrDto = {
            startDate: contractValues.startDate,
            endDate: contractValues.endDate,
            user: contractValues.user, // This is the accountId not identifier
            owner: contractValues.owner, // This is the accountId not identifier
            vehicle: contractValues.vehicle,
        };
        const document: OcrDto = {
            startDate: this.document.ocr.start,
            endDate: this.document.ocr.end,
            user: this.userAccount.accountId, // This is the accountId not identifier
            owner: this.ownerAccount.accountId, // This is the accountId not identifier
            vehicle: this.document.ocr.car,
        };
        this.ocrErrorMessage = this.leaseContractOcrService.performOcr(contractOCR, document);
        if (this.ocrErrorMessage) {
            this.ocrFail = true;
            return;
        }
        this.ocrFail = false;
    }

    onCreateContract() {
        const value = this.createContractForm.getRawValue();
        if (this.ocrCompleted) {
            this.compareToOcr(value.details);
        }
        if (!this.ocrFail) {
            this.submitForm();
        }
    }

    submitForm() {
        const value = this.createContractForm.getRawValue();
        this.createContractState.submit();
        this.leaseContractService
            .createLeaseContract({ ...value.details, ...value.document })
            .pipe(takeUntil(this.$destroy))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully created Vehicle Contract', result);
                    this.createContractState.onSuccess(i18next.t('create-contract.success'), result);
                    this.complete.emit(this.createContractState);
                },
                (error) => {
                    this.logger.error('Failed to create Vehicle Contract', error);
                    this.createContractState.onFailure(i18next.t('create-contract.fail'), error.error);
                    this.complete.emit(this.createContractState);
                },
            );
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.unsubscribe();
    }
}
