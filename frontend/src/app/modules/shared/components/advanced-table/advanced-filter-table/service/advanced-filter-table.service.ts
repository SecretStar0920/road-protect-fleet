import { Injectable, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Dictionary, get } from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { AppState } from '../../../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { GeneralEntityNGRX } from '@modules/shared/models/ngrx/general-entity-ngrx.helper';

export class AdvancedTableColumn {
    key: string;
    title: string;
    isDisplaying?: boolean = true;

    // Some columns use a whole model as column key for template cells/columns. But spreadsheet needs a single value to display
    spreadsheetKey?: string;
    // spreadsheetKey?: string = this.key;
    // Some columns have special formatting, such as dates or currency
    spreadsheetFormat?: 'currency' | 'date' | 'number' | 'json' | 'default' = 'default';
}

export class AdvancedTableConfiguration {
    primaryColumnKey: string = 'id';
    enableRowSelect: boolean = true;
    enableStandardFilters: boolean = true;
    enableAdvancedFilters: boolean = true;
    enableColumnFilter: boolean = true;
    enableExport: boolean = true;
}

@Injectable()
export class AdvancedFilterTableService implements OnInit, OnDestroy {
    // Options
    options: AdvancedTableConfiguration = new AdvancedTableConfiguration();

    // Data
    pageData: any[] = []; // original

    private updateData$ = new Subject();

    // Default Columns
    private _defaultColumns: AdvancedTableColumn[]; // All columns
    get defaultColumns(): AdvancedTableColumn[] {
        return this._defaultColumns;
    }

    set defaultColumns(value: AdvancedTableColumn[]) {
        this._defaultColumns = plainToClass(AdvancedTableColumn, value);
        this.columns = this.defaultColumns;
    }

    // Columns
    private _columns: AdvancedTableColumn[]; // All columns
    get columns(): AdvancedTableColumn[] {
        return this._columns;
    }

    set columns(value: AdvancedTableColumn[]) {
        this._columns = plainToClass(AdvancedTableColumn, value);
    }

    rowActionsTemplate: TemplateRef<any>; // Row action
    rowDeleteTemplate: TemplateRef<any>; // Row delete
    templateColumns: Dictionary<TemplateRef<any>> = {};

    private _ngrxHelper: GeneralEntityNGRX<any, any, any, any>;
    get ngrxHelper(): GeneralEntityNGRX<any, any, any, any> {
        return this._ngrxHelper;
    }

    set ngrxHelper(value: GeneralEntityNGRX<any, any, any, any>) {
        this._ngrxHelper = value;
    }

    selectedRowIds: Dictionary<boolean> = {};
    selectedRowCount: number = 0;
    isCurrentPageSelected: boolean = false;

    // Sider/Drawer
    viewFilters: boolean = false;
    viewColumns: boolean = false;

    constructor(private logger: NGXLogger, private store: Store<AppState>) {}

    ngOnInit(): void {}

    // Self update of internal data via store and external selector function
    selectDataFromStore() {
        this.updateData$.next();
        if (!this.ngrxHelper) {
            return;
        }
        this.logger.debug('Selecting data for current table:', this.ngrxHelper.name);
        this.clearRowSelections();
        this.store.pipe(select(this.ngrxHelper.selectCurrentPageData()), takeUntil(this.updateData$)).subscribe((result: any[]) => {
            this.pageData = result;
        });
        this.store.pipe(select(this.ngrxHelper.selectSelectedRowCount()), takeUntil(this.updateData$)).subscribe((result) => {
            this.selectedRowCount = result;
        });
        this.store.pipe(select(this.ngrxHelper.selectIsCurrentPageSelected()), takeUntil(this.updateData$)).subscribe((result) => {
            this.isCurrentPageSelected = result;
        });
        this.store.pipe(select(this.ngrxHelper.selectCurrentlySelectedRowIds(), takeUntil(this.updateData$))).subscribe((result) => {
            this.selectedRowIds = {};
            result.forEach((id) => {
                this.selectedRowIds[id] = true;
            });
        });
    }

    // Data
    getCellValue(key: string, data: any) {
        return get(data, key, '');
    }

    // Selection
    onSelectRow(data: any, selected: boolean) {
        const primaryKey = data[this.options.primaryColumnKey];
        // Add or remove the key
        if (selected) {
            this.selectedRowIds[primaryKey] = true;
        } else {
            delete this.selectedRowIds[primaryKey];
        }
        this.store.dispatch(this.ngrxHelper.setSelectedRowIds({ ids: Object.keys(this.selectedRowIds) }));
    }

    onSelectAllVisibleRows(value: boolean) {
        for (const dataItem of this.pageData) {
            const primaryKey = dataItem[this.options.primaryColumnKey];
            // Add or remove the key
            if (value) {
                this.selectedRowIds[primaryKey] = true;
            } else {
                delete this.selectedRowIds[primaryKey];
            }
        }
        this.store.dispatch(this.ngrxHelper.setSelectedRowIds({ ids: Object.keys(this.selectedRowIds) }));
    }

    clearRowSelections() {
        this.selectedRowIds = {};
        this.store.dispatch(this.ngrxHelper.setSelectedRowIds({ ids: [] }));
    }

    isSelectedRow(data: any) {
        return this.selectedRowIds[data[this.options.primaryColumnKey]];
    }

    //////////////////////////////////////////////////////////////////
    // SIDERS / DRAWERS
    //////////////////////////////////////////////////////////////////

    // Filter drawer Drawer
    openFilters() {
        this.viewFilters = true;
    }

    closeFiltersSider() {
        this.viewFilters = false;
    }

    openColumns() {
        this.viewColumns = true;
    }

    closeColumnsSider() {
        this.viewColumns = false;
    }

    ngOnDestroy(): void {
        this.updateData$.next();
    }
}
