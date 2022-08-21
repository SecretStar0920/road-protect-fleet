import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AdvancedTableNameEnum, TablePreset } from '@modules/shared/components/advanced-table/user-presets/service/user-preset.service';
import i18next from 'i18next';
import { EditPresetModalComponent } from '@modules/shared/components/advanced-table/query-builder/basic-query-builder/components/edit-preset-modal/edit-preset-modal.component';
import { UserPresetState } from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.reducer';
import {
    currentTableView,
    userPresets,
    userStateLoading,
} from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.selectors';
import { takeUntil } from 'rxjs/operators';
import {
    requestDeleteUserPresets,
    requestUserPresets,
    requestSaveUserPresets,
} from '@modules/shared/components/advanced-table/user-presets/ngrx/user-preset.actions';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'rp-manage-presets-modal',
    templateUrl: './manage-presets-modal.component.html',
    styleUrls: ['./manage-presets-modal.component.less'],
})
export class ManagePresetsModalComponent implements OnInit, OnDestroy {
    constructor(
        private fb: FormBuilder,
        private store: Store<UserPresetState>,
        private modal: NzModalRef,
        private modalService: NzModalService,
    ) {}
    private destroy$ = new Subject();
    savePresetsForm: FormGroup;
    editPresetsModal: NzModalRef<any>;
    defaultPreset: any;
    userPresets: TablePreset[];
    currentTableView: AdvancedTableNameEnum;
    isLoading: number;

    ngOnInit(): void {
        this.savePresetsForm = this.fb.group({
            name: new FormControl(null, Validators.required),
        });
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
                }
            });
        this.store
            .select(userStateLoading)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result) => (this.isLoading = result));
    }

    onCancel() {
        this.modal.close();
    }

    onEditPreset(preset: TablePreset) {
        this.editPresetsModal = this.modalService.create({
            nzTitle: i18next.t('general-query-builder.edit_presets'),
            nzContent: EditPresetModalComponent,
            nzFooter: null,
            nzComponentParams: { preset },
        });
    }

    onDeletePreset(preset: TablePreset) {
        this.store.dispatch(requestDeleteUserPresets.request({ request: { preset, currentTable: this.currentTableView } }));
    }

    changeDefault(preset: TablePreset, selectedDefault: boolean) {
        const updatedPreset = cloneDeep(preset);
        updatedPreset.default = selectedDefault;
        this.store.dispatch(requestSaveUserPresets.request({ request: { preset: updatedPreset, currentTable: this.currentTableView } }));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
