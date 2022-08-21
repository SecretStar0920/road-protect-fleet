import { Injectable, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { cloneDeep, find, forEach, get, includes, isEmpty, isNil } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import Fuse from 'fuse.js';
import IFuseOptions = Fuse.IFuseOptions;
import { DatePipe } from '@angular/common';
import { InfringementStatus } from '@modules/shared/models/entities/infringement.model';
import { select, Store } from '@ngrx/store';
import { showPreviousYearComparison } from '@modules/graphing/ngrx/graphing.selector';
import { GraphingState } from '@modules/graphing/ngrx/graphing.reducer';
import * as moment from 'moment';
import i18next from 'i18next';

export interface TableColumn {
    key: string;
    title?: string;
    sticky?: boolean;
    subColumns?: { title: string; key: string; sticky?: boolean }[];
}

export class TableConfiguration {
    primaryColumnKey: string = 'id';
    enableColumnFilter: boolean = false;
    enableRowSelect: boolean = false;
    enableGlobalSearch: boolean = false;
    export: {
        enabled: boolean;
        entity: string;
    } = {
        enabled: false,
        entity: '',
    };
}

export class GeneralRawGraphingByData {
    registration?: string;
    name?: string;
    offenceDate?: string;
    sum?: number;
    status?: InfringementStatus;
    count?: number;
}

export class GeneralCompositeKeyData {
    [compositeKey: string]: GeneralMappedGraphingByData;
}

export class GeneralMappedGraphingByData {
    registration?: string;
    name?: string;
    offenceDate?: string;
    statusName?: string;
    sum?: number;
    status?: { [key: string]: GeneralGraphingByData };
    count?: number;
}

export class GeneralGraphingByData {
    sum?: number;
    count?: number;
}

@Injectable()
export class GraphingTableService implements OnInit, OnDestroy {
    // Slider/Drawer
    viewMore: boolean = false;

    _data: any[] = []; // original
    filteredData: any[] = []; // filtered, searched, sorted
    primaryKey: string;

    @Input()
    set data(value: any[]) {
        this._data = value;
        this.filteredData = this._data;
        if (isNil(this._data) || isEmpty(this._data)) {
            return;
        }
        this.initialiseColumns();
        if (this.options.enableGlobalSearch) {
            this.initialiseSearch();
        }
    }

    private destroy$ = new Subject();
    // Columns
    customColumns: TableColumn[];
    templateColumns: { [key: string]: TemplateRef<any> } = {};
    columnActionTemplate: TemplateRef<any>;
    rowDeleteTemplate: TemplateRef<any>; // Row delete
    filterColumns: { [key: string]: { value?: string[]; options?: string[] } } = {};
    filteredColumns: TableColumn[];
    columns: TableColumn[];
    enabledColumns: Set<string> = new Set<string>();
    currentSortColumn: { key: string; order: string };
    comparisonShowing: boolean = false;
    compositeObject: GeneralCompositeKeyData = {};
    previousYearCompositeObject: { [key: number]: GeneralCompositeKeyData } = {};
    numberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    // Selection
    selectedRows: { [key: string]: boolean } = {};

    // Options
    public options: TableConfiguration = new TableConfiguration();

    // Search
    fuseSearchOptions: IFuseOptions<any>;
    fuseSearch: Fuse<any>;
    searchTerm$: Subject<string> = new Subject<string>();
    searchTerm: string = '';

    constructor(private logger: NGXLogger, private datePipe: DatePipe, private store: Store<GraphingState>) {}

    // Columns
    private initialiseColumns() {
        this.columns = this.customColumns || [];
        this.columns.forEach((column) => {
            this.enabledColumns.add(column.title);
        });
        this.filteredColumns = this.columns;
    }

    // Selection
    onSelectRow(data: any, value: boolean) {
        this.selectedRows[data[this.options.primaryColumnKey]] = value;
    }

    onSelectAllRows(value: boolean) {
        this._data.forEach((dataItem) => {
            this.onSelectRow(dataItem, value);
        });
    }

    isSelectedRow(data: any) {
        return this.selectedRows[data[this.options.primaryColumnKey]];
    }

    async ngOnInit() {
        this.store.pipe(select(showPreviousYearComparison), takeUntil(this.destroy$)).subscribe((result) => {
            if (!isNil(result)) {
                this.comparisonShowing = result;
            }
        });
    }

    public getSelectedRows(): any[] {
        const selectedDataRows: any[] = [];
        forEach(this.selectedRows, (value, key) => {
            if (value) {
                selectedDataRows.push(
                    find(this._data, (dataItem) => {
                        return dataItem[this.options.primaryColumnKey] === key;
                    }),
                );
            }
        });
        return selectedDataRows;
    }

    // Columns

    toggleColumn(name: string, value: boolean): void {
        value ? this.enabledColumns.add(name) : this.enabledColumns.delete(name);
        this.filteredColumns = this.columns.filter((column) => this.enabledColumns.has(column.title));
    }

    // Drawer

    onOpenConfiguration() {
        this.viewMore = true;
    }

    onCloseConfiguration() {
        this.viewMore = false;
    }

    // Search

    initialiseSearch() {
        const keys = (this.columns ? this.columns : []).concat(this.customColumns ? this.customColumns : []).map((column) => column.key);
        this.fuseSearchOptions = {
            shouldSort: false,
            threshold: 0.2,
            location: 0,
            distance: 100,
            minMatchCharLength: 1,
            keys,
        };

        this.fuseSearch = new Fuse(this.filteredData, this.fuseSearchOptions);
        this.searchTerm$.pipe(distinctUntilChanged(), debounceTime(300)).subscribe((searchTerm) => {
            this.searchTerm = searchTerm;
            this.logger.debug('Search changed', this.searchTerm);
            this.update();
        });
    }

    onSearch(inputEvent) {
        this.searchTerm$.next(inputEvent.target.value);
    }

    search() {
        this.fuseSearch.setCollection(this.filteredData);
        if (isNil(this.searchTerm) || isEmpty(this.searchTerm)) {
            return;
        }
        this.filteredData = this.fuseSearch.search(this.searchTerm).map((item) => item.item);
    }

    onFilter() {
        this.logger.debug('Filter changed', this.filterColumns);
        this.update();
    }

    filter() {
        if (isEmpty(this.filterColumns)) {
            return;
        }
        this.filteredData = this.filteredData.filter((data) => {
            let keep = true;
            forEach(this.filterColumns, (value, key) => {
                if (!isNil(value) && !isEmpty(value.value)) {
                    if (!includes(value.value, get(data, key))) {
                        keep = false;
                    }
                }
            });
            return keep;
        });
    }

    // Sorting

    onSort($event: { key: string; value: string }) {
        this.currentSortColumn = { key: $event.key, order: $event.value };
        this.logger.debug('Sort changed', this.currentSortColumn);
        this.update();
    }

    sort() {
        if (isNil(this.currentSortColumn)) {
            this.sortByPrimaryColumnKey();
            return;
        }

        this.filteredData = this.filteredData
            .sort((a, b) => {
                const aValue = `${this.getValue({ key: this.currentSortColumn.key }, a)}`;
                const bValue = `${this.getValue({ key: this.currentSortColumn.key }, b)}`;
                if (!aValue || !bValue) {
                    return -1;
                }
                if (a.offenceDate === i18next.t('graphing-by.total_amount')) {
                    return -1;
                }
                if (b.offenceDate === i18next.t('graphing-by.total_amount')) {
                    return 1;
                }
                if (this.currentSortColumn.order === 'ascend') {
                    return aValue.localeCompare(bValue, undefined, { numeric: true });
                } else {
                    return bValue.localeCompare(aValue, undefined, { numeric: true });
                }
            })
            .slice();
    }

    private sortByPrimaryColumnKey() {
        this.filteredData = this.filteredData
            .sort((a, b) => {
                const aValue = `${get(a, this.options.primaryColumnKey, '')}`;
                const bValue = `${get(b, this.options.primaryColumnKey, '')}`;
                if (!aValue || !bValue) {
                    return -1;
                }
                return aValue.localeCompare(bValue, undefined, { numeric: true });
            })
            .slice();
    }

    private update() {
        // reset
        this.filteredData = cloneDeep(this._data);
        this.logger.debug('Updating table filter');
        // Sort
        this.sort();
        this.logger.debug('Sorted');
        // Filter
        if (this.options.enableColumnFilter) {
            this.filter();
            this.logger.debug('Filtered');
        }
        // Search
        if (this.options.enableGlobalSearch) {
            this.search();
            this.logger.debug('Searched');
        }
    }

    // Data
    getCellBasicValue(key: string, data: any) {
        return get(data, key, '');
    }

    getValue(columnData: TableColumn, dataRow: { [key: string]: string }) {
        const columnKey = columnData.key.split('_', 2); // key_type;
        const key = columnKey[0];
        const type = columnKey[1]; // count or cost
        if (key === this.primaryKey) {
            return dataRow[this.primaryKey];
        }

        return dataRow[key][type] || 0;
    }

    getCellDate(dataRow: { [key: string]: string }): string {
        if (dataRow[this.primaryKey] === i18next.t('graphing-by.total_amount')) {
            return dataRow[this.primaryKey];
        }
        return moment(dataRow[this.primaryKey]).format('MMMM yyyy');
    }

    getCell(columnData: TableColumn, dataRow: { [key: string]: string }): string {
        const columnKey = columnData.key.split('_', 2); // key_type;
        const key = columnKey[0];
        const type = columnKey[1];
        const amount = dataRow[key] ? (dataRow[key][type] ? dataRow[key][type] : 0) : 0;

        if (type === 'count') {
            // Count
            const count = amount;
            if (this.comparisonShowing && key !== 'total') {
                return this.datePipe.transform(key, 'yyyy') + String(count);
            }
            return String(count);
        } else {
            // Cost
            const sum = Number(amount);
            if (this.comparisonShowing && key !== 'total') {
                return this.datePipe.transform(key, 'yyyy') + ': ₪ ' + sum.toLocaleString('he-IL', this.numberFormatOptions);
            }
            return '₪ ' + sum.toLocaleString('he-IL', this.numberFormatOptions);
        }
    }

    getSumTotalByMonth(dataRow: { [key: string]: any }): string {
        let sumVal = dataRow['Total']?.sum ?? "0";
        const sum = '₪ ' + Number(sumVal).toLocaleString('he-IL', this.numberFormatOptions)
        const sumText = i18next.t('graphing-by.sum') + `(${sum})`

        return sumText
    }

    getCountTotalByMonth(dataRow: { [key: string]: any }): string {
        let countVal = dataRow['Total']?.count ?? "0";
        const countText = i18next.t('graphing-by.count') + `(${countVal})`
        return countText
    }

    getCellDetails(columnData: TableColumn, dataRow: { [key: string]: string }): GeneralMappedGraphingByData {
        const key = columnData.key.split('_', 1)[0];
        return this.compositeObject[`${dataRow[this.primaryKey]}${key}`];
    }

    getCellPreviousYear(columnData: TableColumn, dataRow: { [key: string]: string }, year: string): string {
        if (isNil(this.previousYearCompositeObject)) {
            return;
        }
        const columnKey = columnData.key.split('_', 2); // key_type;
        const key = columnKey[0];
        const type = columnKey[1];
        const previousDate = moment(dataRow.offenceDate).subtract(year, 'year').toISOString();
        if (type === 'count') {
            // Count
            let count: string;
            if (dataRow.offenceDate === i18next.t('graphing-by.total_amount')) {
                count = this.previousYearCompositeObject[year][`total${key}`]?.count || 0;
            } else {
                // key to previous year's date
                count = this.previousYearCompositeObject[year][`${previousDate}${key}`]?.count || 0;
            }
            if (dataRow.offenceDate !== i18next.t('graphing-by.total_amount')) {
                return this.datePipe.transform(previousDate, 'yyyy') + ': ' + String(count);
            }
            return String(count);
        } else {
            // Cost
            let cost: string;
            if (dataRow.offenceDate === i18next.t('graphing-by.total_amount')) {
                cost = this.previousYearCompositeObject[year][`total${key}`]?.sum || 0;
            } else {
                cost = this.previousYearCompositeObject[year][`${previousDate}${key}`]?.sum || 0;
            }
            if (dataRow.offenceDate !== i18next.t('graphing-by.total_amount')) {
                return (
                    this.datePipe.transform(previousDate, 'yyyy') + ': ₪ ' + Number(cost).toLocaleString('he-IL', this.numberFormatOptions)
                );
            }
            return '₪ ' + Number(cost).toLocaleString('he-IL', this.numberFormatOptions);
        }
    }

    getCellPreviousYearDetails(columnData: TableColumn, dataRow: { [key: string]: string }, year: string): GeneralMappedGraphingByData {
        const key = columnData.key.split('_', 1)[0];
        if (key === 'total') {
            return this.previousYearCompositeObject[year][`${dataRow[this.primaryKey]}${key}`];
        } else {
            // key to previous year's date
            const previousDate = moment(dataRow.offenceDate)
                .subtract(+year, 'year')
                .toISOString();
            return this.previousYearCompositeObject[year][`${previousDate}${key}`];
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
