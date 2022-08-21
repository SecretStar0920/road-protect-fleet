import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-nomination-page',
    templateUrl: './create-nomination-page.component.html',
    styleUrls: ['./create-nomination-page.component.less'],
})
export class CreateNominationPageComponent implements OnInit {
    createNominationState: ElementStateModel<Nomination> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Nomination>) {
        this.createNominationState = state;

        if (this.createNominationState.hasSucceeded()) {
            this.message.success(this.createNominationState.successResult().message);
        } else if (this.createNominationState.hasFailed()) {
            this.message.error(this.createNominationState.failedResult().message);
        }
    }
}
