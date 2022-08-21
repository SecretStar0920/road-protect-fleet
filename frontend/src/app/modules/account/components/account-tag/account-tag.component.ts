import { Component, Input, OnInit } from '@angular/core';
import { Account } from '@modules/shared/models/entities/account.model';

@Component({
    selector: 'rp-account-tag',
    templateUrl: './account-tag.component.html',
    styleUrls: ['./account-tag.component.less'],
})
export class AccountTagComponent implements OnInit {
    @Input() account: Account;

    constructor() {}

    ngOnInit() {}
}
