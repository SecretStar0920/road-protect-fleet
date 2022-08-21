import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-location-modal',
    templateUrl: './view-location-modal.component.html',
    styleUrls: ['./view-location-modal.component.less'],
})
export class ViewLocationModalComponent implements OnInit {
    @Input() locationId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
