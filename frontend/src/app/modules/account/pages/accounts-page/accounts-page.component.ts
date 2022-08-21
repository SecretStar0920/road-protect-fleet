import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-accounts-page',
    templateUrl: './accounts-page.component.html',
    styleUrls: ['./accounts-page.component.less'],
})
export class AccountsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private router: Router) {}

    ngOnInit() {}
}
