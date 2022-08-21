import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { infringementNgrxHelper } from '@modules/infringement/ngrx/infringement.reducer';

@Component({
    selector: 'rp-infringements-page',
    templateUrl: './infringements-page.component.html',
    styleUrls: ['./infringements-page.component.less'],
})
export class InfringementsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private router: Router, private store: Store<AppState>) {}

    ngOnInit() {
        this.store.dispatch(infringementNgrxHelper.setQueryParams({ query: { mine: false } }));
    }
}
