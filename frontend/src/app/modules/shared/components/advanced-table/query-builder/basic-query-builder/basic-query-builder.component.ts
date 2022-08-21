import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FilterKey, FilterKeyType, FilterKeyVisibility } from '@modules/shared/models/filter-key.model';
import { AdvancedQueryFilterService } from '@modules/shared/services/query-builder/advanced-query-filter.service';
import { CondOperator } from '@modules/shared/constants/cond-operator.enum';
import { cloneDeep, forEach, get, groupBy, includes, isEmpty, isNil } from 'lodash';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getChangedObject } from '@modules/shared/functions/get-update-obj.function';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { flatten } from 'flat';
import { take, takeUntil } from 'rxjs/operators';
import i18next from 'i18next';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
    AdvancedTableNameEnum,
    TablePreset,
    UserPresetService,
} from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { ManagePresetsModalComponent } from '@modules/shared/components/advanced-table/query-builder/basic-query-builder/components/manage-presets-modal/manage-presets-modal.component';
import { EditPresetModalComponent } from '@modules/shared/components/advanced-table/query-builder/basic-query-builder/components/edit-preset-modal/edit-preset-modal.component';
import {
    requestUserPresets,
    setCurrentColumns,
    setCurrentFilters,
} from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { Store } from '@ngrx/store';
import { UserPresetState } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.reducer';
import { currentTableView, userPresets } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.selectors';
import { Subject } from 'rxjs';
import { AdvancedFilterTableService } from '@modules/shared/components/advanced-table/advanced-filter-table/service/advanced-filter-table.service';

@Component({
    selector: 'rp-basic-query-builder',
    templateUrl: './basic-query-builder.component.html',
    styleUrls: ['./basic-query-builder.component.less'],
})
export class BasicQueryBuilderComponent implements OnInit, OnDestroy {
    @Input() visibility = FilterKeyVisibility.None;
    visibilities = FilterKeyVisibility;
    filterTypes = FilterKeyType;
    operators = CondOperator;
    savePresetsModal: NzModalRef<any>;
    managePresetsModal: NzModalRef<any>;
    selectedPreset: TablePreset;
    private destroy$ = new Subject();
    currentTableView: AdvancedTableNameEnum;
    useDefaultPreset: boolean;

    userPresets: TablePreset[];
    get visibleFilters() {
        return this.query.filterKeys.filter((filter) => filter.visibility >= this.visibility);
    }

    get groupedVisibleFilters() {
        return groupBy(this.visibleFilters, 'type');
    }

    filterForm = this.fb.group({});
    clearForm: FormGroup;
    selectedFilters: any = {};

    //////////////////////////////////////////////////////////////////
    // AUTOCOMPLETE
    //////////////////////////////////////////////////////////////////

    constructor(
        public query: AdvancedQueryFilterService,
        private fb: FormBuilder,
        public table: AdvancedFilterTableService,
        private router: Router,
        private store: Store<UserPresetState>,
        private modalService: NzModalService,
        private activatedRoute: ActivatedRoute,
        private userPresetService: UserPresetService,
    ) {}

    ngOnInit(): void {
        this.getParameters();
        this.initialiseForm();
        this.store
            .select(currentTableView)
            .pipe(takeUntil(this.destroy$))
            .subscribe((tableName) => (this.currentTableView = tableName));
        this.store
            .select(userPresets)
            .pipe(takeUntil(this.destroy$))
            .subscribe((preset) => {
                if (!preset) {
                    this.store.dispatch(requestUserPresets.request({ request: null }));
                } else if (this.currentTableView && preset) {
                    this.userPresets = preset[this.currentTableView];
                    this.applyDefaultPreset();
                }
            });
    }

    private applyDefaultPreset() {
        if (!this.useDefaultPreset) {
            return;
        }
        const defaultPreset = this.userPresets?.find((preset) => preset.default === true);
        if (!!defaultPreset) {
            this.selectedPreset = defaultPreset;
            this.onChangeActivePreset(false);
        }
    }

    private getParameters() {
        this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
            if (!isEmpty(params)) {
                const tempFilters = {};
                // Ensure the default presets are used by default unless specified
                this.useDefaultPreset = true;
                Object.keys(params).forEach((key) => {
                    if (key === 'useDefaultPreset') {
                        this.useDefaultPreset = params[key] === 'true';
                    } else if (key.includes('.min')) {
                        const tempKey = key.substring(0, key.indexOf('.min'));
                        tempFilters[tempKey] = { ...tempFilters[tempKey], min: params[key] };
                    } else if (key.includes('.max')) {
                        const tempKey = key.substring(0, key.indexOf('.max'));
                        tempFilters[tempKey] = { ...tempFilters[tempKey], max: params[key] };
                    } else {
                        tempFilters[key] = params[key];
                    }
                });

                this.selectedFilters = tempFilters;
            }
        });
    }

    private initialiseForm() {
        if (this.clearForm) {
            this.filterForm = cloneDeep(this.clearForm);
            return;
        }
        this.filterForm = this.fb.group({});
        this.clearForm = this.fb.group({});
        const filterKeys = this.query.filterKeys;
        for (const filterKey of filterKeys) {
            this.addFilterFormGroup(filterKey);
        }
        this.onAddAllFilters();
    }

    @HostListener('document:keyup', ['$event'])
    onEnter($event: KeyboardEvent) {
        if ($event.key === 'Enter') {
            this.onAddAllFilters();
        }
    }

    onAddAllFilters() {
        // Clear
        this.query.onClear({ triggerRefresh: false });

        // Add all filters that are different from the blank filters
        const changedValues = getChangedObject(this.clearForm.value, this.filterForm.value);
        forEach(this.filterForm.value, (value, key) => {
            // Special case for existence filters, value is null, but we still want to add it
            if (includes([this.operators.NOT_NULL, this.operators.IS_NULL], value.operator)) {
                this.query.form.setValue(value);
                this.query.onAddFilter('and', false);
                this.selectedFilters[value.key.key] = value.operator;
            } else if (!isEmpty(get(value, 'value', null))) {
                this.query.form.setValue(value);
                this.query.onAddFilter('and', false);
                this.selectedFilters[value.key.key] = value.value;
            } else {
                this.query.onRemoveFilter(value, false);
                delete this.selectedFilters[value.key.key];
            }
        });

        // On clicking search, the page number should be returned to 1
        this.query.currentQuery.setPage(1);
        // Update the query with the selected options
        this.query.setCurrentQueryOptions({});
        // Trigger refresh
        const flatOptions: Params = flatten(this.selectedFilters, { safe: true });
        // Update store with params
        this.store.dispatch(setCurrentFilters({ filters: cloneDeep(this.selectedFilters) }));
        // flaten to ensure that [Object: object] is not added as a parameter for range values
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: flatOptions,
        });
    }

    onClearAllFilters(clearPreset: boolean = true) {
        if (clearPreset) {
            this.selectedPreset = null;
            this.table.columns = this.table.defaultColumns;
        }
        this.initialiseForm();
        this.selectedFilters = {};
        this.onAddAllFilters();
    }

    onChangeActivePreset(clearForm: boolean = true) {
        // Filters
        if (clearForm) {
            this.onClearAllFilters(false);
        }
        if (!!this.selectedPreset?.filters && Object.keys(this.selectedPreset?.filters).length > 0) {
            Object.keys(this.selectedPreset.filters).forEach((key) => {
                const value = this.selectedPreset.filters[key];
                if (includes([this.operators.NOT_NULL, this.operators.IS_NULL], value)) {
                    const operator = this.getFormControl(key, 'operator');
                    operator.setValue(value);
                } else {
                    const control = this.getFormControl(key, 'value');
                    control.setValue(value);
                }
            });
            this.onAddAllFilters();
        }
        // Columns
        if (!!this.selectedPreset?.columns && this.selectedPreset.columns.length > 0) {
            this.table.columns = this.userPresetService.setDisplayingColumns(this.table.columns, this.selectedPreset.columns);
        } else {
            this.table.columns = this.table.defaultColumns;
        }
    }

    onSavePreset() {
        this.store.dispatch(setCurrentColumns({ columns: cloneDeep(this.table.columns) }));
        this.savePresetsModal = this.modalService.create({
            nzTitle: i18next.t('general-query-builder.save_as_preset'),
            nzContent: EditPresetModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    onManagePresets() {
        this.managePresetsModal = this.modalService.create({
            nzTitle: i18next.t('general-query-builder.manage_presets'),
            nzContent: ManagePresetsModalComponent,
            nzFooter: null,
            nzComponentParams: {},
        });
    }

    addFilterFormGroup(filterKey: FilterKey) {
        let value = null;
        let operator = this.decideOnOperator(filterKey.type);
        const selectedFilteredValue = get(this.selectedFilters, filterKey.key, false);
        if (selectedFilteredValue) {
            if (filterKey.type === FilterKeyType.Existence) {
                operator = selectedFilteredValue;
                value = selectedFilteredValue;
            } else if (filterKey.type === FilterKeyType.Dropdown && typeof selectedFilteredValue === 'string') {
                value = selectedFilteredValue.split(',');
            } else {
                value = selectedFilteredValue;
            }
        }

        this.filterForm.addControl(
            filterKey.key,
            this.fb.group({
                key: new FormControl(filterKey, Validators.required),
                operator: new FormControl(operator),
                value: new FormControl(value),
                order: new FormControl(null),
            }),
        );
        this.clearForm.addControl(
            filterKey.key,
            this.fb.group({
                key: new FormControl(filterKey, Validators.required),
                operator: new FormControl(this.decideOnOperator(filterKey.type)),
                value: new FormControl(null),
                order: new FormControl(null),
            }),
        );
    }

    private decideOnOperator(type: FilterKeyType): CondOperator {
        // Default Operator based on type
        let operator: CondOperator;
        // Would be better to use a map here and then index maybe
        if (type === FilterKeyType.String) {
            operator = CondOperator.CONTAINS;
        } else if (type === FilterKeyType.Dropdown) {
            operator = CondOperator.IN;
        } else if (type === FilterKeyType.ExactString) {
            operator = CondOperator.EQUALS;
        } else if (type === FilterKeyType.Number) {
            operator = CondOperator.BETWEEN;
        } else if (type === FilterKeyType.Date) {
            operator = CondOperator.BETWEEN;
        } else if (type === FilterKeyType.Boolean) {
            operator = CondOperator.EQUALS;
        } else if (type === FilterKeyType.Existence) {
            // Sneaky trick to get ISNULL and NOTNULL operators to work with form resets etc
            // This works because the form changes the operator not the value
            operator = null;
        }
        return operator;
    }

    getFormControl(group: string, control: string): FormControl {
        try {
            return this.filterForm.controls[group]['controls'][control];
        } catch (e) {
            return null;
        }
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
