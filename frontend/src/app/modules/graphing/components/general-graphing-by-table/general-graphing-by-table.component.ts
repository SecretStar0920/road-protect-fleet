import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralMappedGraphingByData, GraphingTableService, TableColumn } from '@modules/graphing/services/graphing-table.service';
import i18next from 'i18next';

@Component({
    selector: 'rp-general-graphing-by-table',
    templateUrl: './general-graphing-by-table.component.html',
    providers: [GraphingTableService],
    styleUrls: ['./general-graphing-by-table.component.less'],
})
export class GeneralGraphingByTableComponent implements OnInit, OnDestroy {
    @Input() table: GraphingTableService;
    pageSize = 30;
    pageSizeOptions = [10, 20, 30, 40, 50, 100];
    scroll: { x: string; y?: string } = {
        x: '100%',
        y: '300px',
    };
    rowSpan = 2;
    private destroy$ = new Subject();

    loading: boolean;

    constructor() {}

    async ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }

    calculateClass(data: GeneralMappedGraphingByData, column: TableColumn) {
        let classString: string = ' ';
        if (column.sticky) {
            classString += 'sticky-column ';
        }
        if (data.offenceDate === i18next.t('graphing-by.total_amount')) {
            classString += 'total-row ';
        }
        if (data.offenceDate === i18next.t('graphing-by.total_amount') && column.sticky) {
            classString += 'total-amount-cell ';
        }
        return classString;
    }

    async onSort($event: { key: string; value: string }) {
        this.loading = true;

        setTimeout(() => {
            this.table.onSort($event);
            this.loading = false;
        }, 50);
    }
}
