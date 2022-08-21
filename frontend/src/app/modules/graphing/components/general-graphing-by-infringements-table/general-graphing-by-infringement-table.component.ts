import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphingTableService } from '@modules/graphing/services/graphing-table.service';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { takeUntil } from 'rxjs/operators';
import { GraphingParameters } from '@modules/graphing/ngrx/graphing.actions';
import { selectedParameters } from '@modules/graphing/ngrx/graphing.selector';
import { Store } from '@ngrx/store';
import { InfringementState } from '@modules/infringement/ngrx/infringement.reducer';

@Component({
    selector: 'rp-graphing-infringement-table',
    templateUrl: './general-graphing-by-infringement-table.component.html',
    providers: [GraphingTableService],
    styleUrls: ['./general-graphing-by-infringement-table.component.less'],
})
export class GeneralGraphingByInfringementTableComponent implements OnInit, OnDestroy {
    @Input() table: GraphingTableService;
    filterKeyVisibility = FilterKeyVisibility.None;
    private destroy$ = new Subject();
    selectedParameters: GraphingParameters;

    loading: boolean;

    constructor(private store: Store<InfringementState>) {}

    async ngOnInit() {
        this.store
            .select(selectedParameters)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => {
                this.selectedParameters = result;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
