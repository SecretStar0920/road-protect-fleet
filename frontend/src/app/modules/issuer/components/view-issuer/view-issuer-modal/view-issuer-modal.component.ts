import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-issuer-modal',
    templateUrl: './view-issuer-modal.component.html',
    styleUrls: ['./view-issuer-modal.component.less'],
})
export class ViewIssuerModalComponent implements OnInit {
    @Input() issuerId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
