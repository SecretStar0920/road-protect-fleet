import { Component, OnInit } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-create-issuer-page',
    templateUrl: './create-issuer-page.component.html',
    styleUrls: ['./create-issuer-page.component.less'],
})
export class CreateIssuerPageComponent implements OnInit {
    createIssuerState: ElementStateModel<Issuer> = new ElementStateModel();

    constructor(private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: ElementStateModel<Issuer>) {
        this.createIssuerState = state;

        if (this.createIssuerState.hasSucceeded()) {
            this.message.success(this.createIssuerState.successResult().message);
        } else if (this.createIssuerState.hasFailed()) {
            this.message.error(this.createIssuerState.failedResult().message);
        }
    }
}
