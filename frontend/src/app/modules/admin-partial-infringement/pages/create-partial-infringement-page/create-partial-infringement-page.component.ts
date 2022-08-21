import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-partial-infringement-page',
    templateUrl: './create-partial-infringement-page.component.html',
    styleUrls: ['./create-partial-infringement-page.component.less'],
})
export class CreatePartialInfringementPageComponent implements OnInit {
    createPartialInfringementState: ElementStateModel<PartialInfringement> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<PartialInfringement>) {
        this.createPartialInfringementState = state;

        if (this.createPartialInfringementState.hasSucceeded()) {
            this.message.success(this.createPartialInfringementState.successResult().message);
        } else if (this.createPartialInfringementState.hasFailed()) {
            this.message.error(this.createPartialInfringementState.failedResult().message);
        }
    }
}
