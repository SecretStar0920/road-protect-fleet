import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-integration-request-log-modal',
    templateUrl: './view-integration-request-log-modal.component.html',
    styleUrls: ['./view-integration-request-log-modal.component.less'],
})
export class ViewIntegrationRequestLogModalComponent implements OnInit {
    @Input() integrationRequestLogId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}
}
