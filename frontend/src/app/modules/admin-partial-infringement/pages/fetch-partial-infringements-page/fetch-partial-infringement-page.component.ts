import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FetchPartialInfringementResponse,
    PartialInfringementService,
} from '@modules/admin-partial-infringement/services/partial-infringement.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';

@Component({
    selector: 'rp-fetch-partial-infringement-page',
    templateUrl: './fetch-partial-infringement-page.component.html',
    styleUrls: ['./fetch-partial-infringement-page.component.less'],
})
export class FetchPartialInfringementPageComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    response: FetchPartialInfringementResponse;
    fetchPartialInfringementState: ElementStateModel<AccountRelation> = new ElementStateModel();

    constructor(private partialInfringementService: PartialInfringementService) {}

    ngOnInit() {}

    onFetchPartialInfringements() {
        this.fetchPartialInfringementState.submit();
        this.partialInfringementService
            .fetchPartialInfringements()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (results) => {
                    this.response = results;
                    this.fetchPartialInfringementState.onSuccess('Successfully fetched new partial infringements');
                },
                (error) => {
                    this.fetchPartialInfringementState.onFailure('Failed to fetch new partial infringements', error.error);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
