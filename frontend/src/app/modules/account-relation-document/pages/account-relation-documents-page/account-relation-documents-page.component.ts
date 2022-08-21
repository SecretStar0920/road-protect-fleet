import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CreateAccountRelationDocumentModalComponent } from '@modules/account-relation-document/components/create-account-relation-document/create-account-relation-document-modal/create-account-relation-document-modal.component';
import { Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-account-relation-documents-page',
    templateUrl: './account-relation-documents-page.component.html',
    styleUrls: ['./account-relation-documents-page.component.less'],
})
export class AccountRelationDocumentsPageComponent implements OnInit {
    viewAccountRelationDocumentModal: NzModalRef<any>;
    createAccountRelationDocumentModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewAccountRelationDocument(accountRelationDocumentId: number) {
        if (!accountRelationDocumentId) {
            this.logger.warn('Tried to view an Account Relation Document without an accountRelationDocument id');
            return;
        }
        this.router.navigate(['/home', 'accountRelationDocuments', 'view', accountRelationDocumentId]);
        // Modal version
        // this.viewAccountRelationDocumentModal = this.modalService.create({
        //     nzTitle: 'View AccountRelationDocument',
        //     nzContent: ViewAccountRelationDocumentModalComponent,
        //     nzComponentParams: {
        //         accountRelationDocumentId
        //     },
        //     nzFooter: null
        // });
    }

    onCreateAccountRelationDocument() {
        this.createAccountRelationDocumentModal = this.modalService.create({
            nzTitle: 'Create AccountRelationDocument',
            nzContent: CreateAccountRelationDocumentModalComponent,
            nzFooter: null,
        });
    }
}
