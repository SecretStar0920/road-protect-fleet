import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-infringement-modal',
    templateUrl: './view-infringement-modal.component.html',
    styleUrls: ['./view-infringement-modal.component.less'],
})
export class ViewInfringementModalComponent implements OnInit {
    @Input() infringementId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
