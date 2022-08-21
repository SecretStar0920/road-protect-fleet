import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateAccountRelationModalComponent } from '@modules/account-relation/components/create-account-relation/create-account-relation-modal/create-account-relation-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-account-relations-page',
    templateUrl: './account-relations-page.component.html',
    styleUrls: ['./account-relations-page.component.less'],
})
export class AccountRelationsPageComponent implements OnInit {
    viewAccountRelationModal: NzModalRef<any>;
    createAccountRelationModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewAccountRelation(accountRelationId: number) {
        if (!accountRelationId) {
            this.logger.warn('Tried to view an Account Relation without an accountRelation id');
            return;
        }
        this.router.navigate(['/home', 'accountRelations', 'view', accountRelationId]);
        // Modal version
        // this.viewAccountRelationModal = this.modalService.create({
        //     nzTitle: 'View AccountRelation',
        //     nzContent: ViewAccountRelationModalComponent,
        //     nzComponentParams: {
        //         accountRelationId
        //     },
        //     nzFooter: null
        // });
    }

    onCreateAccountRelation() {
        this.createAccountRelationModal = this.modalService.create({
            nzTitle: 'Create AccountRelation',
            nzContent: CreateAccountRelationModalComponent,
            nzFooter: null,
        });
    }
}
