import { Injectable, Input, TemplateRef } from '@angular/core';
import { cloneDeep, find, forEach, get, includes, isEmpty, isNil } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import Fuse from 'fuse.js';
import IFuseOptions = Fuse.IFuseOptions;

export interface BasicTableColumn {
    key: string;
    title: string;
}

export class TableConfiguration {
    primaryColumnKey: string = 'id';
    enableColumnFilter: boolean = true;
    enableRowSelect: boolean = true;
    enableGlobalSearch: boolean = true;
    export: {
        enabled: boolean;
        entity: string;
    } = {
        enabled: false,
        entity: '',
    };
}

@Injectable()
export class GeneralTableService {
    // Sider/Drawer
    viewMore: boolean = false;

    _data: any[] = []; // original
    filteredData: any[] = []; // filtered, searched, sorted

    @Input()
    set data(value: any[]) {
        this._data = value;
        this.filteredData = this._data;
        if (isNil(this._data) || isEmpty(this._data)) {
            return;
        }
        this.initialiseColumns();
        this.initialiseSearch();
    }

    // Columns
    customColumns: BasicTableColumn[];
    templateColumns: { [key: string]: TemplateRef<any> } = {};
    columnActionTemplate: TemplateRef<any>;
    rowDeleteTemplate: TemplateRef<any>; // Row delete
    filterColumns: { [key: string]: { value?: string[]; options?: string[] } } = {};
    filteredColumns: BasicTableColumn[];
    columns: BasicTableColumn[];
    enabledColumns: Set<string> = new Set<string>();
    currentSortColumn: { key: string; order: string };

    // Selection
    selectedRows: { [key: string]: boolean } = {};

    // Options
    public options: TableConfiguration = new TableConfiguration();

    // Search
    fuseSearchOptions: IFuseOptions<any>;
    fuseSearch: Fuse<any>;
    searchTerm$: Subject<string> = new Subject<string>();
    searchTerm: string = '';

    constructor(private logger: NGXLogger) {}

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

    // Data
    getCellValue(key: string, data: any) {
        return get(data, key, '');
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
                const aValue = `${get(a, this.currentSortColumn.key, '')}`;
                const bValue = `${get(b, this.currentSortColumn.key, '')}`;
                if (!aValue || !bValue) {
                    return -1;
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
        this.filter();
        this.logger.debug('Filtered');
        // // Search
        this.search();
        this.logger.debug('Searched');
    }
}
