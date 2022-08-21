import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep, isNil } from 'lodash';
import { AppState } from '../../../../ngrx/app.reducer';
import { Subject } from 'rxjs';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';

@Component({
    selector: 'rp-municipally-redirect-nomination-page',
    templateUrl: './municipally-redirect-nomination-page.component.html',
    styleUrls: ['./municipally-redirect-nomination-page.component.less'],
})
export class MunicipallyRedirectNominationPageComponent implements OnInit, OnDestroy {
    nominationId: number;
    nomination: Nomination;
    destroy$ = new Subject();

    constructor(private activatedRoute: ActivatedRoute, private store: Store<AppState>) {
        this.activatedRoute.params.subscribe((result) => {
            this.nominationId = result.id;
            this.getNomination();
        });
    }

    ngOnInit() {}

    getNomination() {
        this.store.dispatch(nominationNgrxHelper.getOneReq({ id: this.nominationId }));
        this.store.pipe(select(getNominationById(this.nominationId)), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.nomination = cloneDeep(result);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
