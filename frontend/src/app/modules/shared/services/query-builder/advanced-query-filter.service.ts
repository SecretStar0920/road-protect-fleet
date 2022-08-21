import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { flatten, unflatten } from 'flat';
import { QueryFilter, QuerySort, RequestQueryBuilder } from '@nestjsx/crud-request';
import { take } from 'rxjs/operators';
import { filter, find, includes, isEmpty, isNil, remove } from 'lodash';
import { plainToClass } from 'class-transformer';
import { FilterKey } from '@modules/shared/models/filter-key.model';
import { CondOperator } from '@modules/shared/constants/cond-operator.enum';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SavedFilter } from '@modules/shared/models/saved-filter.model';
import { PaginationResponseInterface } from '@modules/shared/models/pagination-response.interface';
import { saveAs } from 'file-saver';
import { ApiQueryService } from '@modules/shared/services/query-service/ApiQueryService';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';
import { SortOrder } from '@modules/shared/components/advanced-table/general-sort/general-sort.component';

interface OnClearParams {
    clearForm?: boolean;
    triggerRefresh?: boolean;
}

interface SetCurrentQueryOptionsParams {
    updateFrontendQueryUrl?: boolean;
    triggerDataRefresh?: boolean;
}

/**
 * We serialize the filters to save them by using this interface which is the
 * private variables of the RequestQueryBuilder class
 */
export interface FilterOptions {
    _filter: QueryFilter[];
    _or: QueryFilter[];
    _sort: QuerySort[];
}

@Injectable() // DO NOT INJECT IN ROOT, this is injected PER ADVANCED FILTER COMPONENT via component injection (see providers in @Component)
export class AdvancedQueryFilterService {
    //////////////////////////////////////////////////////////////////
    // Core
    //////////////////////////////////////////////////////////////////
    currentQuery: RequestQueryBuilder;
    currentOptions: FilterOptions;

    //////////////////////////////////////////////////////////////////
    // Form
    //////////////////////////////////////////////////////////////////
    form: FormGroup = this.fb.group({
        key: new FormControl(null, Validators.required),
        operator: new FormControl(null, Validators.required),
        value: new FormControl(null), // Either a single value or an array
        order: new FormControl(null),
    });

    //////////////////////////////////////////////////////////////////
    // Options and Configuration
    //////////////////////////////////////////////////////////////////

    private _filterKeys: FilterKey[] = [];
    get filterKeys(): FilterKey[] {
        return this._filterKeys;
    }

    set filterKeys(value: FilterKey[]) {
        this._filterKeys = plainToClass(FilterKey, value);
    }

    private _fixedFilters: QueryFilter[];
    get fixedFilters(): QueryFilter[] {
        return this._fixedFilters;
    }

    set fixedFilters(value: QueryFilter[]) {
        this._fixedFilters = value;
        this.setCurrentQueryOptions({});
    }

    private _page: number;
    get page(): number {
        return this._page;
    }

    set page(value: number) {
        this._page = value;
        if (this.currentQuery) {
            this.currentQuery.setPage(this._page);
            this.setCurrentQueryOptions({});
        }
    }

    private _limit: number = 20;
    get limit(): number {
        return this._limit;
    }

    set limit(value: number) {
        this._limit = value;
        if (this.currentQuery) {
            this.currentQuery.setLimit(this._limit);
            this.setCurrentQueryOptions({});
        }
    }

    total: number;

    dateFormat: string = 'MMM d, y, h:mm:ss a';

    //////////////////////////////////////////////////////////////////
    // Saved Filter Management
    //////////////////////////////////////////////////////////////////
    savedFilters: SavedFilter[] = this.getFilters();
    saveFilterVisible: boolean = false;

    //////////////////////////////////////////////////////////////////
    // Loading States
    //////////////////////////////////////////////////////////////////
    dataLoadingState: ElementStateModel = new ElementStateModel<any>();
    spreadsheetLoadingState: ElementStateModel = new ElementStateModel<any>();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private queryService: ApiQueryService<any>,
        private tableService: AdvancedFilterTableService,
    ) {}

    //////////////////////////////////////////////////////////////////
    // Setup
    //////////////////////////////////////////////////////////////////

    setCurrentQueryOptions({ updateFrontendQueryUrl = false, triggerDataRefresh = true }: SetCurrentQueryOptionsParams) {
        if (!this.currentQuery) {
            return;
        }

        // Whether to update the data or not
        if (triggerDataRefresh) {
            this.refreshData();
        }

        // Serialize options
        this.currentOptions = this.currentQuery as any;

        // Update URL
        if (!updateFrontendQueryUrl) {
            return;
        }
        const flatOptions: Params = flatten(this.currentOptions);
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: flatOptions,
        });
    }

    /**
     * Parameter handling
     */
    initialiseQueryFromParameters() {
        this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
            if (!isEmpty(params)) {
                this.currentQuery = plainToClass(RequestQueryBuilder, unflatten(params) as object);
                this.setCurrentQueryOptions({});
            } else {
                this.onClear({});
            }
        });
    }

    //////////////////////////////////////////////////////////////////
    // Current filter management
    //////////////////////////////////////////////////////////////////

    onClear({ clearForm = false, triggerRefresh = true }: OnClearParams) {
        this.currentQuery = RequestQueryBuilder.create({
            filter: this.fixedFilters,
            page: this.page || 1,
            limit: this.limit || 10,
        });
        this.setCurrentQueryOptions({ triggerDataRefresh: triggerRefresh });

        if (clearForm) {
            this.form.reset();
        }
    }

    onAdd() {
        if (!isNil(this.form.controls.value)) {
            this.onAddFilter('and');
        }
        if (this.form.controls.order.value === 'ASC' || this.form.controls.order.value === 'DESC') {
            this.onAddSort();
        }
        this.form.reset();
    }

    canSort(key: string) {
        const filterKey: FilterKey = find(this.filterKeys, (filter) => {
            // Find by key or column key being the same
            return includes([filter.key, filter.columnKey], key);
        });
        if (filterKey) {
            return filterKey.sortable;
        }
        return false;
    }

    /**
     * Called on table
     */
    onSort($event: { key: string; value: SortOrder }) {
        this.onSortByTableHeading($event.key, $event.value);
    }

    onSortByTableHeading(key: string, order: any) {
        // Always clear current sort for the field else it adds duplicates (it's not very smart :()
        this.currentQuery.queryObject.sort = filter(this.currentQuery.queryObject.sort, (sort: string) => {
            return !sort.includes(key);
        });

        if (!isNil(order) && order !== SortOrder.None) {
            // If not null, then add either ASC/DESC filter
            const mappedOrder = order === SortOrder.Asc ? 'ASC' : 'DESC';
            this.currentQuery.sortBy({
                field: key,
                order: mappedOrder,
            });
        }
        // UpdateS
        this.setCurrentQueryOptions({});
    }

    onAddSort() {
        this.currentQuery.sortBy({
            field: this.form.value.key.key,
            order: this.form.value.order,
        });
        this.setCurrentQueryOptions({});
    }

    onAddFilter(type: 'or' | 'and' = 'and', triggerDataRefresh: boolean = true) {
        let value = this.form.value.value;
        const operator = this.form.value.operator;
        const keyType = this.form.value.key.type;

        // 1. Do some mapping of values for different operators or types
        if (includes(['date'], keyType)) {
            // We parse the date received with moment to make sure the value is safe
            if (operator !== CondOperator.BETWEEN) {
                value = moment(value).toISOString();
            }
            // Need to send between as MIN,MAX format, also handle some defaults
            if (operator === CondOperator.BETWEEN) {
                const min = value.min || moment().subtract(50, 'years');
                const max = value.max || moment().add(50, 'years');
                value = `${moment(min).toISOString()},${moment(max).toISOString()}`;
            }
        } else if (includes(['number', 'string'], keyType)) {
            // Need to send between as MIN,MAX format, also handle some defaults
            if (operator === CondOperator.BETWEEN) {
                const min = value.min || -2147483647;
                const max = value.max || 2147483647;
                value = `${min},${max}`;
            }
        }
        // 2. Update NestJSX Crud query builder
        if (type === 'or') {
            this.currentQuery.setOr({
                field: this.form.value.key.key,
                operator: this.form.value.operator,
                value,
            });
        } else if (type === 'and') {
            this.currentQuery.setFilter({
                field: this.form.value.key.key,
                operator: this.form.value.operator,
                value,
            });
        }

        this.setCurrentQueryOptions({ triggerDataRefresh });
    }

    onSetFilter(filter: FilterOptions, triggerDataRefresh: boolean = true) {
        this.currentQuery = plainToClass(RequestQueryBuilder, filter);
        this.setCurrentQueryOptions({ triggerDataRefresh });
    }

    onRemoveSort(sort: QuerySort) {
        remove(this.currentOptions._sort, sort);
        this.onSetFilter(this.currentOptions);
    }

    onRemoveFilter(filter: QueryFilter, triggerDataRefresh: boolean = true) {
        remove(this.currentOptions._filter, filter);
        this.onSetFilter(this.currentOptions, triggerDataRefresh);
    }

    onRemoveOr(or: QueryFilter) {
        remove(this.currentOptions._or, or);
        this.onSetFilter(this.currentOptions);
    }

    //////////////////////////////////////////////////////
    // Stored Filter Management
    //////////////////////////////////////////////////////

    onRemoveSavedFilter(name: string) {
        remove(this.savedFilters, (filter) => filter.name === name);
        localStorage.setItem(`${this.router.url}_filter`, JSON.stringify(this.savedFilters));
    }

    onSaveFilter(name: string) {
        if (!name) {
            return;
        }
        const savedFilter: SavedFilter = plainToClass(SavedFilter, {
            id: null,
            name,
            filter: this.currentOptions,
        });
        if (this.savedFilters) {
            this.savedFilters.push(savedFilter);
        } else {
            this.savedFilters = [savedFilter];
        }
        localStorage.setItem(`${this.router.url}_filter`, JSON.stringify(this.savedFilters));
        this.saveFilterVisible = false;
    }

    getFilters() {
        return plainToClass(SavedFilter, JSON.parse(localStorage.getItem(`${this.router.url}_filter`)) as any[]);
    }

    //////////////////////////////////////////////////////////////////
    // Data Querying and Refresh
    //////////////////////////////////////////////////////////////////

    refreshData() {
        if (!this.currentQuery) {
            return;
        }
        this.dataLoadingState.submit();
        this.queryService.query(this.currentQuery.query()).subscribe(
            (result: PaginationResponseInterface<any>) => {
                this.total = result.total;
                this._page = result.page;
                this.dataLoadingState.onSuccess();
            },
            (error) => {
                this.dataLoadingState.onFailure();
            },
        );
    }

    exportToExcel() {
        this.spreadsheetLoadingState.submit();
        this.queryService.queryAsSpreadsheet(this.currentQuery.query(), this.tableService.columns).subscribe(
            (result) => {
                this.spreadsheetLoadingState.onSuccess();
                saveAs(result.file, result.filename);
            },
            (error) => {
                this.spreadsheetLoadingState.onFailure(error.message, error);
            },
        );
    }
}
