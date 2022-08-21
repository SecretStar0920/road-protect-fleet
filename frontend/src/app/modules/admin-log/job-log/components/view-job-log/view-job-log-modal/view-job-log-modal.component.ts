import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-job-log-modal',
    templateUrl: './view-job-log-modal.component.html',
    styleUrls: ['./view-job-log-modal.component.less'],
})
export class ViewJobLogModalComponent implements OnInit {
    @Input() jobLogUuid: string;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}
}
