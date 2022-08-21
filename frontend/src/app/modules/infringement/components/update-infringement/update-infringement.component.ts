import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Infringement, InfringementTag } from '@modules/shared/models/entities/infringement.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { InfringementService } from '@modules/infringement/services/infringement.service';
import { NGXLogger } from 'ngx-logger';
import { getChangedObject } from '@modules/shared/functions/get-update-obj.function';
import i18next from 'i18next';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthState, currentUser } from '@modules/auth/ngrx/auth.reducer';
import { select, Store } from '@ngrx/store';
import { User, UserType } from '@modules/shared/models/entities/user.model';
import { isNil } from 'lodash';
import { Document } from '@modules/shared/models/entities/document.model';

@Component({
    selector: 'rp-update-infringement',
    templateUrl: './update-infringement.component.html',
    styleUrls: ['./update-infringement.component.less'],
})
export class UpdateInfringementComponent implements OnInit, OnDestroy {
    @Input() infringement: Infringement;
    private destroy$ = new Subject();

    updateInfringementForm: FormGroup;
    updateInfringementState: ElementStateModel<Infringement> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Infringement>> = new EventEmitter();
    private original: any;

    availableTags = Object.keys(InfringementTag)

    infringementDocuments: Document[] = []

    user: User;

    get f() {
        return this.updateInfringementForm.controls;
    }

    constructor(
        private infringementService: InfringementService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private authStore: Store<AuthState>
    ) {}

    ngOnInit() {
        this.updateInfringementForm = this.fb.group({
            noticeNumber: new FormControl({ value: this.infringement.noticeNumber, disabled: true }, Validators.required),
            reason: new FormControl(this.infringement.reason, []),
            reasonCode: new FormControl(this.infringement.reasonCode, []),
            type: new FormControl(this.infringement.type, []),
            issuer: new FormControl(this.infringement.issuer.code, Validators.required),
            issuerStatus: new FormControl(this.infringement.issuerStatus, Validators.required),
            issuerStatusDescription: new FormControl(this.infringement.issuerStatusDescription),
            vehicle: new FormControl({ value: this.infringement.vehicle.registration, disabled: true }, Validators.required),
            amountDue: new FormControl(this.infringement.amountDue, Validators.required),
            caseNumber: new FormControl(this.infringement.caseNumber),
            brn: new FormControl(this.infringement.brn),
            offenceDate: new FormControl(this.infringement.offenceDate.toDate(), Validators.required),
            latestPaymentDate: new FormControl(this.infringement.latestPaymentDate.toDate(), Validators.required),
            documentIds: new FormControl(),
            streetName: new FormControl('', Validators.required),
            streetNumber: new FormControl(''),
            city: new FormControl(''),
            country: new FormControl('', Validators.required),
            code: new FormControl(''),
            tags: new FormControl(this.infringement.tags),
        });


        if (!isNil(this.infringement.document?.documentId)) {
            this.infringementDocuments.push(this.infringement.document)
        }

        this.infringement.extraDocuments.forEach( (document) => {
            this.infringementDocuments.push(document)
        })

        if (this.infringement.location) {
            this.updateInfringementForm.controls.streetName.setValue(this.infringement.location.streetName);
            this.updateInfringementForm.controls.streetNumber.setValue(this.infringement.location.streetNumber);
            this.updateInfringementForm.controls.city.setValue(this.infringement.location.city);
            this.updateInfringementForm.controls.country.setValue(this.infringement.location.country);
            this.updateInfringementForm.controls.code.setValue(this.infringement.location.code);
        }

        this.original = this.updateInfringementForm.value;

        this.authStore.pipe(select(currentUser), takeUntil(this.destroy$)).subscribe((user) => {
            this.user = user;
        });
    }
    get tagsAreAvailable(): boolean {
        return this.user?.type === UserType.Admin || this.user?.type === UserType.Developer;
    }

    onUpdateInfringement() {
        this.updateInfringementState.submit();
        let changedObject = getChangedObject(this.original, this.updateInfringementForm.value) as any;
        changedObject.documentIds = changedObject.documentIds || []
        for (let document of this.infringementDocuments) {
            changedObject.documentIds.push(document.documentId)
        }

        this.infringementService
            .updateInfringement(this.infringement.infringementId, changedObject)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated Infringement', result);
                    this.updateInfringementState.onSuccess(i18next.t('update-infringement.success'), result);
                    this.complete.emit(this.updateInfringementState);
                },
                (error) => {
                    this.logger.error('Failed to update Infringement', error);
                    this.updateInfringementState.onFailure(i18next.t('update-infringement.fail'), error.error);
                    this.complete.emit(this.updateInfringementState);
                },
            );
    }

    onDeleteDocument(document: Document) {
        this.infringementDocuments = this.infringementDocuments.filter((candidate) => {
            return candidate.documentId !== document.documentId
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
