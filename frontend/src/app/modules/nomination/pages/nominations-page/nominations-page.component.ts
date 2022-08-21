import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateNominationModalComponent } from '@modules/nomination/components/create-nomination/create-nomination-modal/create-nomination-modal.component';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-nominations-page',
    templateUrl: './nominations-page.component.html',
    styleUrls: ['./nominations-page.component.less'],
})
export class NominationsPageComponent implements OnInit {
    viewNominationModal: NzModalRef<any>;
    createNominationModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onCreateNomination() {
        this.createNominationModal = this.modalService.create({
            nzTitle: i18next.t('nominations-page.create_nomination'),
            nzContent: CreateNominationModalComponent,
            nzFooter: null,
        });
    }
}
