import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { GraphingByStatusPageService } from '@modules/graphing/services/graphing-by-status-page.service';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import {
    byStatusMappedData,
    dateRange,
    byStatusPreviousYearMappedData,
    showPreviousYearComparison,
} from '@modules/graphing/ngrx/graphing.selector';
import { takeUntil } from 'rxjs/operators';
import { isNil } from 'lodash';
import i18next from 'i18next';
import { DateRangeDto, GraphingDataManipulationService } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GraphingParameters } from '@modules/graphing/ngrx/graphing.actions';
import { GraphingTableService } from '@modules/graphing/services/graphing-table.service';

@Component({
    selector: 'rp-graphing-by-status-table',
    templateUrl: './graphing-by-status-table.component.html',
    styleUrls: ['./graphing-by-status-table.component.less'],
    providers: [GraphingTableService],
})
export class GraphingByStatusTableComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject();
    @ViewChild('columnTemplate', { static: true }) columnTemplate: TemplateRef<any>;
    @ViewChild('dateColumn', { static: true }) dateColumn: TemplateRef<any>;
    @ViewChild('totalColumn', { static: true }) totalColumn: TemplateRef<any>;
    loading: boolean;
    tableArray: { [key: string]: string }[];
    selectedDateRange: DateRangeDto;
    numberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    comparisonShowing: boolean = false;
    @Output() viewInfringements: EventEmitter<GraphingParameters> = new EventEmitter();
    yearsPrevious: string[];
    columns: string[];

    constructor(
        private graphingByStatusPageService: GraphingByStatusPageService,
        private store: Store<GraphingState>,
        public table: GraphingTableService,
        private graphingDataManipulationService: GraphingDataManipulationService,
    ) {
        this.table.options.enableRowSelect = false;
    }

    async ngOnInit() {
        this.store.pipe(select(byStatusMappedData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.table.compositeObject = result;
                const resultArray = Object.keys(result).map((key) => {
                    return result[key];
                });
                const columnKey = 'statusName';
                const manipulatedData = this.graphingDataManipulationService.manipulateRawToTableData(resultArray, columnKey);
                this.tableArray = manipulatedData.manipulatedData;
                this.columns = manipulatedData.columns;
                this.setupTable();
            }
        });
        this.store.pipe(select(dateRange), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.selectedDateRange = result;
            }
        });
        this.store.pipe(select(byStatusPreviousYearMappedData), takeUntil(this.destroy$)).subscribe((result) => {
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
    }

    private setupTable() {
        if (!!this.columns) {
            this.table.primaryKey = 'offenceDate';
            this.table.customColumns = [
                { key: 'offenceDate', title: i18next.t('graphing-by.offence_month'), sticky: true },
                ...Object.values(this.columns).filter((column) => column !== 'Total').map((column) => {
                    this.table.templateColumns[column + '_count'] = this.columnTemplate;
                    this.table.templateColumns[column + '_sum'] = this.columnTemplate;
                    let title = i18next.t('infringement-status.' + column)
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
