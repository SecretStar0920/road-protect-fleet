import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-infringement-page',
    templateUrl: './create-infringement-page.component.html',
    styleUrls: ['./create-infringement-page.component.less'],
})
export class CreateInfringementPageComponent implements OnInit {
    createInfringementState: ElementStateModel<Infringement> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Infringement>) {
        this.createInfringementState = state;

        if (this.createInfringementState.hasSucceeded()) {
            this.message.success(this.createInfringementState.successResult().message);
        } else if (this.createInfringementState.hasFailed()) {
            this.message.error(this.createInfringementState.failedResult().message);
        }
    }
}
