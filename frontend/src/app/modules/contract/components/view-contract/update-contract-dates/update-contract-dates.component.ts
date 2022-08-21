import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contract } from '@modules/shared/models/entities/contract.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ContractService } from '@modules/contract/services/contract.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-update-contract-dates',
    templateUrl: './update-contract-dates.component.html',
    styleUrls: ['./update-contract-dates.component.less'],
})
export class UpdateContractDatesComponent implements OnInit {
    @Input() contract: Contract;

    @Output() updated: EventEmitter<ElementStateModel> = new EventEmitter<ElementStateModel>();

    form: FormGroup;
    state: ElementStateModel = new ElementStateModel<any>();

    constructor(private fb: FormBuilder, private contractService: ContractService) {
        this.form = this.fb.group({
            startDate: new FormControl(null),
            endDate: new FormControl(null),
        });
    }

    ngOnInit() {
        if (this.contract) {
            this.form.controls.startDate.setValue(moment(this.contract.startDate).toDate());
            // End date can be null
            if (moment(this.contract.endDate).isValid()) {
                this.form.controls.endDate.setValue(moment(this.contract.endDate).toDate());
            }
        }
    }

    onUpdate() {
        this.state.submit();
        this.contractService
            .UpdateContractEndDate(this.contract.contractId, {
                startDate: moment(this.form.value.startDate).toISOString(),
                endDate: moment(this.form.value.endDate).toISOString(),
            })
            .subscribe(
                (result) => {
                    this.state.onSuccess(i18next.t('update-contract-dates.success'));
                    this.updated.emit(this.state);
                },
                (error) => {
                    this.state.onFailure(i18next.t('update-contract-dates.fail'));
                },
            );
    }
}
