import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { AccountService } from '@modules/account/services/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PERMISSIONS } from '@modules/shared/constants/permissions.const';
import i18next from 'i18next';

@Component({
    selector: 'rp-delete-account',
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.less'],
})
export class DeleteAccountComponent implements OnInit {
    @Input() accountId: number;

    permissions = PERMISSIONS;

    deleteAccountState: ElementStateModel<Account> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Account>> = new EventEmitter();

    constructor(private accountService: AccountService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteAccountState.submit();
        this.delete.emit(this.deleteAccountState);
        this.accountService.deleteAccount(this.accountId).subscribe(
            (account) => {
                this.deleteAccountState.onSuccess(i18next.t('delete-account.success'), account);
                this.message.success(this.deleteAccountState.successResult().message);
                this.delete.emit(this.deleteAccountState);
            },
            (error) => {
                this.deleteAccountState.onFailure(i18next.t('delete-account.fail'), error);
                this.message.error(this.deleteAccountState.failedResult().message);
            },
        );
    }
}
