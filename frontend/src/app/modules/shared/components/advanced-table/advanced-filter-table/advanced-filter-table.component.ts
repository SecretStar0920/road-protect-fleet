import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserType } from '@modules/shared/models/entities/user.model';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-advanced-filter-table',
    templateUrl: './advanced-filter-table.component.html',
    styleUrls: ['./advanced-filter-table.component.less'],
})
export class AdvancedFilterTableComponent implements OnInit, OnDestroy {
    scroll: { x: string; y?: string } = {
        x: '100%',
        y: '100px',
    };
    pageSizeOptions = [10, 20, 30, 40, 50, 100];
    private destroy$ = new Subject();

    userTypes = UserType;
    actionModalVisible: boolean = false;
    selectedData: any;
    @Input() filterVisibility: FilterKeyVisibility = FilterKeyVisibility.None;

    constructor(public query: AdvancedQueryFilterService, public table: AdvancedFilterTableService) {}

    ngOnInit() {
        this.query.onClear({ clearForm: true, triggerRefresh: false });
    }

    onClickRow(data: any) {
        this.selectedData = data;
        this.actionModalVisible = true;
    }

    cancelActionModal() {
        this.actionModalVisible = false;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
