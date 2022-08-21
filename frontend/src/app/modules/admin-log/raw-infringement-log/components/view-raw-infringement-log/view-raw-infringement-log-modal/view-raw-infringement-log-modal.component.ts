import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-raw-infringement-log-modal',
    templateUrl: './view-raw-infringement-log-modal.component.html',
    styleUrls: ['./view-raw-infringement-log-modal.component.less'],
})
export class ViewRawInfringementLogModalComponent implements OnInit {
    @Input() rawInfringementLogId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}
}
