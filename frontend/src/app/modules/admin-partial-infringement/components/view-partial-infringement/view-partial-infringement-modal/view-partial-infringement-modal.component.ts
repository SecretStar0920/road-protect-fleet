import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-partial-infringement-modal',
    templateUrl: './view-partial-infringement-modal.component.html',
    styleUrls: ['./view-partial-infringement-modal.component.less'],
})
export class ViewPartialInfringementModalComponent implements OnInit {
    @Input() partialInfringementId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
