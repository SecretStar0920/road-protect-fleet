import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountUser } from '@modules/shared/models/entities/account-user.model';
import { AccountUserService } from '@modules/account-user/services/account-user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-account-user',
    templateUrl: './delete-account-user.component.html',
    styleUrls: ['./delete-account-user.component.less'],
})
export class DeleteAccountUserComponent implements OnInit {
    @Input() accountUserId: number;

    deleteAccountUserState: ElementStateModel<AccountUser> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<AccountUser>> = new EventEmitter();
    permissions = PERMISSIONS;

    constructor(private accountUserService: AccountUserService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteAccountUserState.submit();
        this.delete.emit(this.deleteAccountUserState);
        this.accountUserService.deleteAccountUser(this.accountUserId).subscribe(
            (accountUser) => {
                this.deleteAccountUserState.onSuccess(i18next.t('delete-account-user.success'), accountUser);
                this.message.success(this.deleteAccountUserState.successResult().message);
                this.delete.emit(this.deleteAccountUserState);
            },
            (error) => {
                this.deleteAccountUserState.onFailure(i18next.t('delete-account-user.fail'), error);
                this.message.error(this.deleteAccountUserState.failedResult().message);
            },
        );
    }
}
