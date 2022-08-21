import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { NGXLogger } from 'ngx-logger';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'rp-update-account-relation',
    templateUrl: './update-account-relation.component.html',
    styleUrls: ['./update-account-relation.component.less'],
})
export class UpdateAccountRelationComponent implements OnInit {
    @Input() accountRelation: AccountRelation;

    updateAccountRelationForm: FormGroup;
    updateAccountRelationState: ElementStateModel<AccountRelation> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<AccountRelation>> = new EventEmitter();

    customFields: { [key: string]: string } = {};

    get f() {
        return this.updateAccountRelationForm.controls;
    }

    constructor(private accountRelationService: AccountRelationApiService, private fb: FormBuilder, private logger: NGXLogger) {}

    ngOnInit() {
        this.updateAccountRelationForm = this.fb.group({
            data: new FormGroup({ summary: new FormControl(''), customFields: new FormControl({}) }),
        });

        this.updateAccountRelationForm.controls['data'].setValue(cloneDeep(this.accountRelation.data));
        this.customFields = this.updateAccountRelationForm.controls['data'].value.customFields;
    }

    onUpdateAccountRelation() {
        this.updateAccountRelationState.submit();
        this.accountRelationService
            .updateAccountRelation(this.accountRelation.accountRelationId, this.updateAccountRelationForm.value)
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated Account Relation', result);
                    this.updateAccountRelationState.onSuccess('Successfully updated accountRelation', result);
                    this.complete.emit(this.updateAccountRelationState);
                },
                (error) => {
                    this.logger.error('Failed to update Account Relation', error);
                    this.updateAccountRelationState.onFailure('Failed to update accountRelation', error.error);
                    this.complete.emit(this.updateAccountRelationState);
                },
            );
    }

    onAddCustomField(key: string, value: string) {
        this.customFields[key] = value;
        this.updateAccountRelationForm.controls.data['controls'].customFields.setValue(this.customFields);
    }

    onRemoveCustomField(key: string | number) {
        delete this.customFields[key];
    }
}
