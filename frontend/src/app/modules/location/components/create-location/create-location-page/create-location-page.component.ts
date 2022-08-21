import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Location } from '@modules/shared/models/entities/location.model';
import { NzMessageService } from 'ng-zorro-antd/message';
// import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-location-page',
    templateUrl: './create-location-page.component.html',
    styleUrls: ['./create-location-page.component.less'],
})
export class CreateLocationPageComponent implements OnInit {
    createLocationState: ElementStateModel<Location> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Location>) {
        this.createLocationState = state;

        if (this.createLocationState.hasSucceeded()) {
            this.message.success(this.createLocationState.successResult().message);
        } else if (this.createLocationState.hasFailed()) {
            this.message.error(this.createLocationState.failedResult().message);
        }
    }
}
