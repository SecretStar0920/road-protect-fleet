import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { User } from '@modules/shared/models/entities/user.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.less'],
})
export class ChangePasswordModalComponent implements OnInit {
    @Input() email: string;
    changePasswordState: ElementStateModel<User> = new ElementStateModel();

    constructor(private modal: NzModalRef, private message: NzMessageService) {}

    ngOnInit() {}

    onComplete(state: boolean) {
        if (state) {
            this.changePasswordState.onSuccess(i18next.t('change-password.success'));
        } else {
            this.changePasswordState.onFailure(i18next.t('change-password.fail'));
        }
        if (this.changePasswordState.hasSucceeded()) {
            this.message.success(this.changePasswordState.successResult().message);
            this.modal.close(this.changePasswordState);
        } else if (this.changePasswordState.hasFailed()) {
            this.message.error(this.changePasswordState.failedResult().message);
        }
    }
}
