import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { contractNgrxHelper } from '@modules/contract/ngrx/contract.reducer';

@Component({
    selector: 'rp-contracts-page',
    templateUrl: './contracts-page.component.html',
    styleUrls: ['./contracts-page.component.less'],
})
export class ContractsPageComponent implements OnInit {
    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.dispatch(contractNgrxHelper.setQueryParams({ query: { mine: false } }));
    }
}
