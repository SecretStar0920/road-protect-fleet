import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-nomination-modal',
    templateUrl: './view-nomination-modal.component.html',
    styleUrls: ['./view-nomination-modal.component.less'],
})
export class ViewNominationModalComponent implements OnInit {
    @Input() nominationId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
