import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Driver } from '@modules/shared/models/entities/driver.model';

@Component({
    selector: 'rp-create-driver-page',
    templateUrl: './create-driver-page.component.html',
    styleUrls: ['./create-driver-page.component.less'],
})
export class CreateDriverPageComponent implements OnInit {
    createDriverState: ElementStateModel<Driver> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Driver>) {
        this.createDriverState = state;

        if (this.createDriverState.hasSucceeded()) {
            this.message.success(this.createDriverState.successResult().message);
        } else if (this.createDriverState.hasFailed()) {
            this.message.error(this.createDriverState.failedResult().message);
        }
    }
}
