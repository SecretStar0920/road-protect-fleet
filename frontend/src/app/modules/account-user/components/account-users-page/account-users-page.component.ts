import { Component, OnDestroy, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppState } from '../../../../ngrx/app.reducer';
import { selectAccount } from '@modules/account/ngrx/account.actions';

@Component({
    selector: 'rp-account-users-page',
    templateUrl: './account-users-page.component.html',
    styleUrls: ['./account-users-page.component.less'],
})
export class AccountUsersPageComponent implements OnInit, OnDestroy {
    private $destroy = new Subject();

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router, private store: Store<AppState>) {}

    ngOnInit() {
        this.store.dispatch(selectAccount({ id: null }));
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }
}
