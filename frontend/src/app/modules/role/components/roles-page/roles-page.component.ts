import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateRoleModalComponent } from '@modules/role/components/create-role/create-role-modal/create-role-modal.component';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-roles-page',
    templateUrl: './roles-page.component.html',
    styleUrls: ['./roles-page.component.less'],
})
export class RolesPageComponent implements OnInit {
    viewRoleModal: NzModalRef<any>;
    createRoleModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewRole(roleId: number) {
        if (!roleId) {
            this.logger.warn('Tried to view an Role without an role id');
            return;
        }
        this.router.navigate(['/home', 'roles', 'view', roleId]);
        // Modal version
        // this.viewRoleModal = this.modalService.create({
        //     nzTitle: 'View Role',
        //     nzContent: ViewRoleModalComponent,
        //     nzComponentParams: {
        //         roleId
        //     },
        //     nzFooter: null
        // });
    }

    onCreateRole() {
        this.createRoleModal = this.modalService.create({
            nzTitle: i18next.t('roles-page.create_role'),
            nzContent: CreateRoleModalComponent,
            nzFooter: null,
        });
    }
}
