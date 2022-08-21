import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../../../ngrx/app.reducer';
import { Store } from '@ngrx/store';
import { isNil } from 'lodash';
import { selectAccount } from '@modules/account/ngrx/account.actions';

@Component({
    selector: 'rp-view-account-page',
    templateUrl: './view-account-page.component.html',
    styleUrls: ['./view-account-page.component.less'],
})
export class ViewAccountPageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {
        this.getAccountIdFromParam();
    }

    ngOnInit() {}

    getAccountIdFromParam() {
        this.route.params.subscribe((params) => {
            if (!isNil(params.id)) {
                this.store.dispatch(selectAccount({ id: Number(params.id) }));
            }
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'accounts']);
    }
}
