import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-vehicle-modal',
    templateUrl: './view-vehicle-modal.component.html',
    styleUrls: ['./view-vehicle-modal.component.less'],
})
export class ViewVehicleModalComponent implements OnInit {
    @Input() vehicleId: number;

    constructor(private modal: NzModalRef) {}

    ngOnInit() {}

    onDelete() {
        this.modal.close();
    }
}
