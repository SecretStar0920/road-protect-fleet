import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import i18next from 'i18next';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GraphingTableService } from '@modules/graphing/services/graphing-table.service';
import { GraphingByVehiclePageService } from '@modules/graphing/services/graphing-by-vehicle-page.service';
import {
    byVehiclePreviousYearMappedData,
    dateRange,
    byVehicleMappedData,
    showPreviousYearComparison,
    byVehicleTableData,
} from '@modules/graphing/ngrx/graphing.selector';

@Component({
    selector: 'rp-graphing-by-vehicle-table',
    templateUrl: './graphing-by-vehicle-table.component.html',
    providers: [GraphingTableService],
    styleUrls: ['./graphing-by-vehicle-table.component.less'],
})
export class GraphingByVehicleTableComponent implements OnInit, OnDestroy {
    @ViewChild('generalVehicleCell', { static: true }) generalVehicleCell: TemplateRef<any>;
    @ViewChild('dateColumn', { static: true }) dateColumn: TemplateRef<any>;
    @ViewChild('totalColumn', { static: true }) totalColumn: TemplateRef<any>;

    private destroy$ = new Subject();
    tableArray: { [key: string]: string }[];
    selectedDateRange: DateRangeDto;
    yearsPrevious: string[];
    comparisonShowing: boolean = false;
    columns: string[];

    constructor(
        private graphingByVehiclePageService: GraphingByVehiclePageService,
        private store: Store<GraphingState>,
        public table: GraphingTableService,
    ) {
        this.table.options.enableRowSelect = false;
    }

    async ngOnInit() {
        this.store.pipe(select(byVehicleMappedData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.table.compositeObject = result;
            }
        });
        this.store.pipe(select(byVehicleTableData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.tableArray = result.tableArray;
                this.columns = result.columns;
                this.setupTable();
            }
        });
        this.store.pipe(select(byVehiclePreviousYearMappedData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.table.previousYearCompositeObject = result;
                this.yearsPrevious = Object.keys(result);
            }
        });
        this.store.pipe(select(showPreviousYearComparison), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.comparisonShowing = result;
            }
        });
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.selectedDateRange = result;
            }
        });
    }

    private setupTable() {
        if (!!this.columns) {
            this.table.primaryKey = 'offenceDate';
            this.table.customColumns = [
                { key: 'offenceDate', title: i18next.t('graphing-by.offence_month'), sticky: true },
                ...Object.values(this.columns).filter((column) => column !== 'Total').map((column) => {
                    this.table.templateColumns[column + '_count'] = this.generalVehicleCell;
                    this.table.templateColumns[column + '_sum'] = this.generalVehicleCell;
                    let title = column
                    return {
                        key: column,
                        title: title,
                        subColumns: [
                            { key: column + '_count', title: i18next.t('graphing-by.count') },
                            { key: column + '_sum', title: i18next.t('graphing-by.sum') },
                        ],
                    };
                }),
            ];
            this.table.templateColumns['offenceDate'] = this.dateColumn;
            this.table.templateColumns['Total'] = this.totalColumn;
        }
        if (!isNil(this.tableArray)) {
            this.table.data = this.tableArray.slice();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
