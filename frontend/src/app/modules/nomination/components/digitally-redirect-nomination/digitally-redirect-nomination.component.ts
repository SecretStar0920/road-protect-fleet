import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NominationTarget, Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { skip } from 'rxjs/operators';
import { get } from 'lodash';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Step, Stepper } from '@modules/shared/models/stepper.model';
import { redirectNominationReq } from '@modules/nomination/ngrx/nomination.actions';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { ContractType, LeaseContract } from '@modules/shared/models/entities/contract.model';
import i18next from 'i18next';

@Component({
    selector: 'rp-digitally-redirect-nomination',
    templateUrl: './digitally-redirect-nomination.component.html',
    styleUrls: ['./digitally-redirect-nomination.component.less'],
})
export class DigitallyRedirectNominationComponent implements OnInit {
    stepper = new Stepper([
        new Step({ title: i18next.t('digitally-redirect-nomination.step_1') }),
        new Step({
            title: i18next.t('digitally-redirect-nomination.step_2'),
            description: i18next.t('digitally-redirect-nomination.optional'),
        }),
        new Step({ title: i18next.t('digitally-redirect-nomination.step_3') }),
    ]);

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

    redirectNominationForm: FormGroup;

    constructor(private store: Store<AppState>, private fb: FormBuilder) {}

    ngOnInit() {
        this.redirectNominationForm = this.fb.group({
            reason: new FormControl(),
            documentId: new FormControl(),
            to: new FormControl(NominationTarget.User),
        });

        this.selectedAccount = get(this._nomination, 'account.accountId', undefined);
        // FIXME: very hacky way of checking if it was updated
        this.store.pipe(select(getNominationById(this._nomination.nominationId)), skip(1)).subscribe((result) => {
            this.close.emit(true);
        });
    }

    onConfirm() {
        this.store.dispatch(
            redirectNominationReq({
                nominationId: this._nomination.nominationId,
                dto: {
                    documentId: this.redirectNominationForm.value.documentId,
                    details: { redirectionReason: this.redirectNominationForm.value.reason },
                    to: this.redirectNominationForm.value.to,
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
}
