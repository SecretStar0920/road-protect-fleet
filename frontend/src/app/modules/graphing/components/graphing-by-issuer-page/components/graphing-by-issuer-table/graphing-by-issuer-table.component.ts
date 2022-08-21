import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import {
    dateRange,
    byIssuerMappedData,
    byIssuerPreviousYearMappedData,
    showPreviousYearComparison,
    byIssuerTableData,
} from '@modules/graphing/ngrx/graphing.selector';
import { take, takeUntil } from 'rxjs/operators';
import { cloneDeep, isNil } from 'lodash';
import { GraphingByIssuerPageService } from '@modules/graphing/services/graphing-by-issuer-page.service';
import i18next from 'i18next';
import { DateRangeDto } from '@modules/graphing/services/graphing-data-manipulation.service';
import { GraphingTableService } from '@modules/graphing/services/graphing-table.service';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { policeIssuer } from '@modules/issuer/ngrx/issuer.selectors';

@Component({
    selector: 'rp-graphing-by-issuer-table',
    templateUrl: './graphing-by-issuer-table.component.html',
    providers: [GraphingTableService],
    styleUrls: ['./graphing-by-issuer-table.component.less'],
})
export class GraphingByIssuerTableComponent implements OnInit, OnDestroy {
    @ViewChild('generalIssuerCell', { static: true }) generalIssuerCell: TemplateRef<any>;
    @ViewChild('dateColumn', { static: true }) dateColumn: TemplateRef<any>;
    @ViewChild('totalColumn', { static: true }) totalColumn: TemplateRef<any>;

    private destroy$ = new Subject();
    tableArray: { [key: string]: string }[];
    comparisonShowing: boolean = false;
    yearsPrevious: string[];
    selectedDateRange: DateRangeDto;
    columns: string[];
    policeIssuer: Issuer;

    constructor(
        private graphingByIssuerPageService: GraphingByIssuerPageService,
        private store: Store<GraphingState>,
        public table: GraphingTableService,
    ) {
        this.table.options.enableRowSelect = false;
    }

    async ngOnInit() {
        // Make police issuer sticky
        this.store.pipe(select(policeIssuer), take(1)).subscribe((result) => {
            if (!isNil(result)) {
                this.policeIssuer = result;
            }
        });
        this.store.pipe(select(byIssuerMappedData), take(1)).subscribe((data) => {
            if (!isNil(data)) {
                this.table.compositeObject = data;
            }
        });
        this.store.pipe(select(byIssuerTableData), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.tableArray = result.tableArray;
                this.columns = result.columns;
                this.setupTable();
            }
        });
        this.store.pipe(select(byIssuerPreviousYearMappedData), takeUntil(this.destroy$)).subscribe((result) => {
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
                    this.table.templateColumns[column + '_count'] = this.generalIssuerCell;
                    this.table.templateColumns[column + '_sum'] = this.generalIssuerCell;
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
