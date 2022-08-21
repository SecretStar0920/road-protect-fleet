import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AdvancedTableNameEnum, TablePreset } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import { requestSaveUserPresets } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import {
    currentColumns,
    currentFilters,
    currentTableView,
    userStateLoading,
} from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.selectors';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'rp-edit-presets-modal',
    templateUrl: './edit-preset-modal.component.html',
    styleUrls: ['./edit-preset-modal.component.less'],
})
export class EditPresetModalComponent implements OnInit, OnDestroy {
    constructor(private fb: FormBuilder, private store: Store, private modal: NzModalRef) {}
    @Input() preset: TablePreset;
    filters: any;
    columns: any[];
    private destroy$ = new Subject();
    editPresetsForm: FormGroup;
    currentTableView: AdvancedTableNameEnum;
    isLoading: number;

    ngOnInit(): void {
        this.editPresetsForm = this.fb.group({
            name: new FormControl(this.preset ? this.preset.name : null, [Validators.required, Validators.maxLength(25)]),
            default: new FormControl(this.preset ? this.preset.default : null),
        });
        this.store
            .select(currentTableView)
            .pipe(takeUntil(this.destroy$))
            .subscribe((tableName) => (this.currentTableView = tableName));
        this.store
            .select(userStateLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => (this.isLoading = result));
        this.store
            .select(currentFilters)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => (this.filters = result));
        this.store
            .select(currentColumns)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => (this.columns = result));
    }

    onSavePresets() {
        if (!this.editPresetsForm.valid) {
            return;
        }
        // Create new or update existing
        const newPreset: TablePreset = {
            id: !this.preset ? null : this.preset.id,
            name: this.editPresetsForm.value.name,
            filters: !this.preset ? this.filters : this.preset.filters,
            columns: !this.preset ? this.columns : this.preset.columns,
            default: this.editPresetsForm.value.default,
        };

        this.store.dispatch(requestSaveUserPresets.request({ request: { preset: newPreset, currentTable: this.currentTableView } }));
        this.modal.close();
    }

    onCancel() {
        this.modal.close();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
