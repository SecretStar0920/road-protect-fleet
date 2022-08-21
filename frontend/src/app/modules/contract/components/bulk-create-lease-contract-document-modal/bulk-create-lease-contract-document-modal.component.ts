import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';
import { NGXLogger } from 'ngx-logger';
import { ContractService } from '@modules/contract/services/contract.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Document } from '@modules/shared/models/entities/document.model';

@Component({
    selector: 'rp-create-contract-modal',
    templateUrl: './bulk-create-lease-contract-document-modal.component.html',
    styleUrls: ['./bulk-create-lease-contract-document-modal.component.less'],
})
export class BulkCreateLeaseContractDocumentModalComponent implements OnInit, OnDestroy {
    @Input() selectedContracts: Contract[] = [];
    bulkContractGenerationDetailsForm: FormGroup;
    private destroy$ = new Subject();
    document: Document;
    generateDocumentState: ElementStateModel = new ElementStateModel();

    constructor(
        private modal: NzModalRef,
        private message: NzMessageService,
        private logger: NGXLogger,
        private fb: FormBuilder,
        private contractService: ContractService,
    ) {}

    ngOnInit() {
        this.bulkContractGenerationDetailsForm = this.fb.group({
            representativeDetails: new FormControl('', Validators.required),
        });
    }

    batchGenerateLeaseContractDocuments() {
        this.generateDocumentState.submit();
        this.contractService
            .bulkGenerateLeaseContractDocuments(
                this.selectedContracts.map((i) => {
                    return i.contractId;
                }),
                this.bulkContractGenerationDetailsForm.get('representativeDetails').value,
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (zippedDocument) => {
                    this.document = zippedDocument;
                    this.logger.info('Successfully updated lease contract documents', zippedDocument);
                    this.generateDocumentState.onSuccess(i18next.t('bulk-generate-lease-contract-documents.success'), zippedDocument);
                },
                (error) => {
                    this.logger.error('Failed to update lease contract documents', error);
                    this.generateDocumentState.onFailure(i18next.t('bulk-generate-lease-contract-documents.fail'), error.error);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
