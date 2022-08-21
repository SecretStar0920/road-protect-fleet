import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GeneratedDocumentService } from '@modules/generated-document/services/generated-document.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { getSelectedAccountId } from '@modules/account/ngrx/account.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { GeneratedDocument } from '@modules/shared/models/entities/generated-document.model';
import { Router } from '@angular/router';
import { DocumentLinkableTargets } from '@modules/document/services/document.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateAndLinkDocumentComponent } from '@modules/document/components/create-and-link-document/create-and-link-document.component';

@Component({
    selector: 'rp-create-generated-document',
    templateUrl: './create-generated-document.component.html',
    styleUrls: ['./create-generated-document.component.less'],
})
export class CreateGeneratedDocumentComponent implements OnInit, OnDestroy {
    createAddDocumentModal: NzModalRef<any>;

    @Input() documentTemplate: string;
    @Input() friendlyName?: string;

    // Autofill
    @Input() accountId?: number;
    @Input() contractId?: number;
    @Input() infringementId?: number;

    // Linking
    @Input() shouldAutoLink: boolean = false;
    @Input() target: DocumentLinkableTargets;
    @Input() targetId: string;

    @Input() orUpload: boolean = false;

    @Input() return: boolean = true;

    createGeneratedDocumentState: ElementStateModel = new ElementStateModel<any>();

    destroy$ = new Subject();
    generatedDocument: GeneratedDocument;

    constructor(
        private fb: FormBuilder,
        private generatedDocumentService: GeneratedDocumentService,
        private store: Store<AppState>,
        private router: Router,
        private modalService: NzModalService,
    ) {}

    ngOnInit() {
        this.store.pipe(select(getSelectedAccountId), takeUntil(this.destroy$)).subscribe((accountId) => {
            this.accountId = accountId;
        });
    }

    onGenerate() {
        this.createGeneratedDocumentState.submit();
        this.generatedDocumentService
            .createGeneratedDocument({
                documentTemplateName: this.documentTemplate,
                accountId: this.accountId,
                contractId: this.contractId,
                infringementId: this.infringementId,
            })
            .subscribe(
                (result) => {
                    this.createGeneratedDocumentState.onSuccess();
                    this.generatedDocument = result;
                    this.redirectToEdit();
                },
                (error) => {
                    this.createGeneratedDocumentState.onFailure();
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    redirectToEdit() {
        if (this.return) {
            this.router.navigate(
                ['/home', 'generated-documents', this.generatedDocument.generatedDocumentId, 'edit', this.target, this.targetId],
                {
                    queryParams: {
                        returnTo: this.router.url,
                    },
                },
            );
        } else {
            this.router.navigate([
                '/home',
                'generated-documents',
                this.generatedDocument.generatedDocumentId,
                'edit',
                this.target,
                this.targetId,
            ]);
        }
    }

    onUploadLinkClick() {
        this.createAddDocumentModal = this.modalService.create({
            nzContent: CreateAndLinkDocumentComponent,
            nzFooter: null,
            nzComponentParams: {
                target: this.target,
                targetId: this.targetId,
                description: this.friendlyName,
            },
        });
    }
}
