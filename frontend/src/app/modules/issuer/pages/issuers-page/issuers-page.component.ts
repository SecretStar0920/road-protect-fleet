import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateIssuerModalComponent } from '@modules/issuer/components/create-issuer/create-issuer-modal/create-issuer-modal.component';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-issuers-page',
    templateUrl: './issuers-page.component.html',
    styleUrls: ['./issuers-page.component.less'],
})
export class IssuersPageComponent implements OnInit {
    viewIssuerModal: NzModalRef<any>;
    createIssuerModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewIssuer(issuerId: number) {
        if (!issuerId) {
            this.logger.warn('Tried to view an Issuer without an issuer id');
            return;
        }
        this.router.navigate(['/home', 'issuers', 'view', issuerId]);
        // Modal version
        // this.viewIssuerModal = this.modalService.create({
        //     nzTitle: 'View Issuer',
        //     nzContent: ViewIssuerModalComponent,
        //     nzComponentParams: {
        //         issuerId
        //     },
        //     nzFooter: null
        // });
    }

    onCreateIssuer() {
        this.createIssuerModal = this.modalService.create({
            nzTitle: i18next.t('issuer-page.create_issuer'),
            nzContent: CreateIssuerModalComponent,
            nzFooter: null,
        });
    }
}
