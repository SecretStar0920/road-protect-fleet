import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateDocumentModalComponent } from '@modules/document/components/create-document/create-document-modal/create-document-modal.component';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-documents-page',
    templateUrl: './documents-page.component.html',
    styleUrls: ['./documents-page.component.less'],
})
export class DocumentsPageComponent implements OnInit {
    viewDocumentModal: NzModalRef<any>;
    createDocumentModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewDocument(documentId: number) {
        if (!documentId) {
            this.logger.warn('Tried to view an Document without an document id');
            return;
        }
        this.router.navigate(['/home', 'documents', 'view', documentId]);
        // Modal version
        // this.viewDocumentModal = this.modalService.create({
        //     nzTitle: 'View Document',
        //     nzContent: ViewDocumentModalComponent,
        //     nzComponentParams: {
        //         documentId
        //     },
        //     nzFooter: null
        // });
    }

    onCreateDocument() {
        this.createDocumentModal = this.modalService.create({
            nzTitle: i18next.t('documents-page.create_document'),
            nzContent: CreateDocumentModalComponent,
            nzFooter: null,
        });
    }
}
