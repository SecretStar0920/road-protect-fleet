import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { currentAccountId } from '@modules/auth/ngrx/auth.reducer';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-create-account-relation',
    templateUrl: './create-account-relation.component.html',
    styleUrls: ['./create-account-relation.component.less'],
})
export class CreateAccountRelationComponent implements OnInit, OnDestroy {
    createAccountRelationForm: FormGroup;
    createAccountRelationState: ElementStateModel<AccountRelation> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    private destroy$ = new Subject();
    customFields: { [key: string]: string } = {};

    get f() {
        return this.createAccountRelationForm.controls;
    }

    constructor(
        private store: Store<AppState>,
        private accountRelationService: AccountRelationApiService,
        private fb: FormBuilder,
        private logger: NGXLogger,
    ) {}

    ngOnInit() {
        this.createAccountRelationForm = this.fb.group({
            reverseAccountId: new FormControl(null, Validators.required),
            forwardAccountId: new FormControl(null, Validators.required), // target
            data: new FormGroup({ summary: new FormControl(''), customFields: new FormControl({}) }),
        });
        this.store.pipe(select(currentAccountId), takeUntil(this.destroy$)).subscribe((result) => {
            this.createAccountRelationForm.controls.reverseAccountId.setValue(result);
        });
    }

    onCreateAccountRelation() {
        this.createAccountRelationState.submit();
        this.accountRelationService.createAccountRelation(this.createAccountRelationForm.value).subscribe(
            (result) => {
                this.logger.info('Successfully created Account Relation', result);
                this.createAccountRelationState.onSuccess('Successfully created Account Relation', result);
                this.complete.emit(this.createAccountRelationState);
            },
            (error) => {
                this.logger.error('Failed to create Account Relation', error);
                this.createAccountRelationState.onFailure('Failed to create Account Relation', error.error);
                this.complete.emit(this.createAccountRelationState);
            },
        );
    }

    onAddCustomField(key: string, value: string) {
        this.customFields[key] = value;
        this.createAccountRelationForm.controls.data['controls'].customFields.setValue(this.customFields);
    }

    onRemoveCustomField(key: string | number) {
        delete this.customFields[key];
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
