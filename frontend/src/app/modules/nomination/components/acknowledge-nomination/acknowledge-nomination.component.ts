import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NominationTarget, Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { skip } from 'rxjs/operators';
import { get } from 'lodash';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { acknowledgeNominationReq } from '@modules/nomination/ngrx/nomination.actions';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { ContractType, LeaseContract, OwnershipContract } from '@modules/shared/models/entities/contract.model';

@Component({
    selector: 'rp-acknowledge-nomination',
    templateUrl: './acknowledge-nomination.component.html',
    styleUrls: ['./acknowledge-nomination.component.less'],
})
export class AcknowledgeNominationComponent implements OnInit {
    nominationTarget = NominationTarget;

    private _nomination: Nomination;
    get nomination(): Nomination {
        return this._nomination;
    }

    @Input()
    set nomination(value: Nomination) {
        this._nomination = value;
        this.infringement = this._nomination.infringement;
        this.vehicle = this._nomination.infringement.vehicle;
    }

    vehicle: Vehicle;
    infringement: Infringement;

    contractType = ContractType;

    selectedAccount: number;

    @Output() close: EventEmitter<boolean> = new EventEmitter();

    acknowledgeNominationForm: FormGroup;

    constructor(private store: Store<AppState>, private fb: FormBuilder) {}

    ngOnInit() {
        this.acknowledgeNominationForm = this.fb.group({
            redirection: new FormControl({ value: true, disabled: false }, Validators.required),
            appeal: new FormControl({ value: false, disabled: true }, Validators.required),
            payment: new FormControl({ value: true, disabled: true }, Validators.required),
        });

        this.selectedAccount = get(this._nomination, 'account.accountId', undefined);
        // FIXME: very hacky way of checking if it was updated
        this.store.pipe(select(getNominationById(this._nomination.nominationId)), skip(1)).subscribe((result) => {
            this.close.emit(true);
        });
    }

    onConfirm() {
        this.store.dispatch(
            acknowledgeNominationReq({
                nominationId: this._nomination.nominationId,
                dto: {
                    acknowledgedFor: this.acknowledgeNominationForm.getRawValue(),
                },
            }),
        );
    }

    onCancel() {
        this.close.emit(true);
    }

    asLeaseContract(): LeaseContract {
        return this.nomination.infringement.contract as LeaseContract;
    }

    asOwnershipContract(): OwnershipContract {
        return this.nomination.infringement.contract as OwnershipContract;
    }
}
