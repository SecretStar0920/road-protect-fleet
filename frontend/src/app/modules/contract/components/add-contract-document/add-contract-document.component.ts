import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ContractService } from '@modules/contract/services/contract.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import * as moment from 'moment';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { Document } from '@modules/shared/models/entities/document.model';
import i18next from 'i18next';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-add-contract-document',
    templateUrl: './add-contract-document.component.html',
    styleUrls: ['./add-contract-document.component.less'],
})
export class AddContractDocumentComponent implements OnInit, OnDestroy {
    @ViewChild('ocrError', { static: false }) ocrError: TemplateRef<any>;
    @Input() contract: Contract;
    document: Document;
    ocrErrorMessage: string[] = [''];

    private destroy$ = new Subject();

    form: FormGroup;
    ocrErrorString: string = i18next.t('create-document.ocr.error').concat(': \n');

    ocrFail: boolean = false;
    showSuccess: boolean = false; // Show success message once file has uploaded

    mimeTypes = MIME_TYPES;

    state: ElementStateModel = new ElementStateModel<any>();

    @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private contractService: ContractService, private logger: NGXLogger, private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            documentId: new FormControl(),
        });
    }

    onAddDocument() {
        this.state.submit();
        this.contractService
            .UpdateContractDocument(this.contract.contractId, { documentId: this.form.value.documentId })
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.state.onSuccess();
                    this.refresh.emit(true);
                },
                (error) => {
                    this.state.onFailure();
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
