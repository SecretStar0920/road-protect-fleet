import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { getSelectedAccountId } from '@modules/account/ngrx/account.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MIME_TYPES } from '@modules/shared/constants/mime-types';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AccountService } from '@modules/account/services/account.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Component({
    selector: 'rp-add-power-of-attorney',
    templateUrl: './add-power-of-attorney.component.html',
    styleUrls: ['./add-power-of-attorney.component.less'],
})
export class AddPowerOfAttorneyComponent implements OnInit, OnDestroy {
    form: FormGroup;
    private $destroy = new Subject();

    allowedTypes = MIME_TYPES;

    state: ElementStateModel = new ElementStateModel();

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private modalRef: NzModalRef,
        private accountService: AccountService,
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            accountId: new FormControl(null, Validators.required),
            documentId: new FormControl(null, Validators.required),
        });

        this.store.pipe(select(getSelectedAccountId), takeUntil(this.$destroy)).subscribe((selectedAccountId) => {
            this.form.controls.accountId.setValue(selectedAccountId);
        });
    }

    onAddPA() {
        this.state.submit();
        this.accountService.updateAccountV1(this.form.value.accountId, { documentId: this.form.value.documentId }).subscribe(
            (result) => {
                this.state.onSuccess();
                this.modalRef.close();
            },
            (error) => {
                this.state.onFailure();
            },
        );
    }

    ngOnDestroy(): void {
        this.$destroy.next();
    }
}
