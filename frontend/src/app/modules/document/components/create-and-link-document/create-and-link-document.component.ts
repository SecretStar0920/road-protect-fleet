import { Component, Input, OnInit } from '@angular/core';
import { DocumentLinkableTargets, DocumentService } from '@modules/document/services/document.service';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import i18next from 'i18next';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Document } from '@modules/shared/models/entities/document.model';
import * as moment from 'moment';
import { Store, select } from '@ngrx/store';
import { ContractState, contractNgrxHelper } from '@modules/contract/ngrx/contract.reducer';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Contract } from '@modules/shared/models/entities/contract.model';

@Component({
    selector: 'rp-create-and-link-document',
    templateUrl: './create-and-link-document.component.html',
    styleUrls: ['./create-and-link-document.component.less'],
})
export class CreateAndLinkDocumentComponent implements OnInit {
    @Input() target: DocumentLinkableTargets;
    @Input() targetId: string;
    @Input() description: string;

    documentId: number;
    document: Document;
    contract: Contract;
    private destroy$ = new Subject();
    performOCR: boolean = false;

    ocrFail: boolean = false;
    ocrErrorMessage: string[] = [''];

    stepper: Stepper = new Stepper<any>([
        new Step({ title: i18next.t('create-and-link-document.upload') }),
        new Step({ title: i18next.t('create-and-link-document.finalise') }),
        new Step({ title: i18next.t('create-and-link-document.result') }),
    ]);

    linkState = new ElementStateModel();

    constructor(private documentService: DocumentService, private modal: NzModalRef, private store: Store<ContractState>) {}

    ngOnInit() {
        if (this.target === DocumentLinkableTargets.Contract) {
            this.performOCR = true;
        }
    }

    onLink() {
        this.linkState.submit();
        this.documentService.linkDocument({ targetId: this.targetId, target: this.target, documentId: this.documentId }).subscribe(
            (result) => {
                this.linkState.onSuccess();
                this.stepper.next();
            },
            (error) => {
                this.linkState.onFailure(error.message);
                this.stepper.next();
            },
        );
    }
    onOCR(document: Document) {
        if (this.target === DocumentLinkableTargets.Account) {
            return;
        }
        this.document = document;

        this.store.pipe(select(contractNgrxHelper.selectEntityById(this.targetId)), takeUntil(this.destroy$)).subscribe((contract) => {
            this.contract = contract;
        });

        if (
            !this.contract ||
            +this.contract.owner.identifier !== +this.document.ocr?.owner ||
            +this.contract.user.identifier !== +this.document.ocr?.customer ||
            +this.contract.vehicle.registration !== +this.document.ocr?.car ||
            !moment(this.contract.startDate).startOf('day').isSame(moment(this.document.ocr?.start).startOf('day')) ||
            !moment(this.contract.endDate).startOf('day').isSame(moment(this.document.ocr?.end).startOf('day'))
        ) {
            this.generateErrorMessages();
            this.ocrFail = true;
            this.stepper.next();
            return;
        }
        this.ocrFail = false;
        this.stepper.next();
    }

    generateErrorMessages() {
        if (!this.contract) {
            this.ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_not_found'));
        }
        if (+this.contract?.owner.identifier !== +this.document.ocr?.owner) {
            this.ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_owner_identifier_not_match'));
        }
        if (+this.contract?.user.identifier !== +this.document.ocr?.customer) {
            this.ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_user_identifier_not_match'));
        }
        if (+this.contract?.vehicle.registration !== +this.document.ocr?.car) {
            this.ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_vehicle_registration_not_match'));
        }
        if (!moment(this.contract?.startDate).startOf('day').isSame(moment(this.document.ocr?.start).startOf('day'))) {
            this.ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_start_date_not_match'));
        }
        if (!moment(this.contract?.endDate).startOf('day').isSame(moment(this.document.ocr?.end).startOf('day'))) {
            this.ocrErrorMessage.push(i18next.t('add-contract-document.ocr-error.contract_end_date_not_match'));
        }
    }

    onDocumentUploaded($event: ElementStateModel) {
        if ($event.hasSucceeded()) {
            this.documentId = $event.successResult().context.documentId;
            if (this.target === DocumentLinkableTargets.Contract && !this.ocrFail) {
                return;
            }
            this.stepper.next();
            this.onLink();
        }
    }

    onClose() {
        this.modal.close();
        window.close();
    }

    onRetry() {
        window.location.reload();
    }
}
