import { Component, Input, OnInit } from '@angular/core';
import { AccountRole } from '@modules/shared/models/entities/account.model';

@Component({
    selector: 'rp-account-role-tag',
    templateUrl: './account-role-tag.component.html',
    styleUrls: ['./account-role-tag.component.less'],
})
export class AccountRoleTagComponent implements OnInit {
    @Input() role: AccountRole;

    accountRoleValues = Object.values(AccountRole);
    accountRole = AccountRole;

    constructor() {}

    ngOnInit() {}
}
