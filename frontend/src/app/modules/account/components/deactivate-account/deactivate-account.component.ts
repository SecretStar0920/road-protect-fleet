import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Account } from '@modules/shared/models/entities/account.model';
import { AccountService } from '@modules/account/services/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import i18next from 'i18next';

@Component({
    selector: 'rp-deactivate-account',
    templateUrl: './deactivate-account.component.html',
    styleUrls: ['./deactivate-account.component.less'],
})
export class DeactivateAccountComponent implements OnInit {
    @Input() accountId: number;

    deactivateAccountState: ElementStateModel<Account> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Account>> = new EventEmitter();

    constructor(private accountService: AccountService, private message: NzMessageService) {}

    ngOnInit() {}

    onDeactivate() {
        this.deactivateAccountState.submit();
        this.delete.emit(this.deactivateAccountState);
        this.accountService.toggleAccountActive(this.accountId).subscribe(
            (account) => {
                this.deactivateAccountState.onSuccess(i18next.t('deactivate-account.success'), account);
                this.message.success(this.deactivateAccountState.successResult().message);
                this.delete.emit(this.deactivateAccountState);
            },
            (error) => {
                this.deactivateAccountState.onFailure(i18next.t('deactivate-account.fail'), error);
                this.message.error(this.deactivateAccountState.failedResult().message);
            },
        );
    }
}
