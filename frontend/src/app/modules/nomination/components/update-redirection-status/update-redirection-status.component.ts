import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { select, Store } from '@ngrx/store';
import { getNominationById } from '@modules/nomination/ngrx/nomination.selectors';
import { skip } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { updateRedirectionStatusReq } from '@modules/nomination/ngrx/nomination.actions';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { get } from 'lodash';

@Component({
    selector: 'rp-update-redirect-status',
    templateUrl: './update-redirection-status.component.html',
    styleUrls: ['./update-redirection-status.component.less'],
})
export class UpdateRedirectionStatusComponent implements OnInit {
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

    @Output() close: EventEmitter<boolean> = new EventEmitter();

    constructor(private store: Store<AppState>, private fb: FormBuilder) {}

    ngOnInit() {
        // FIXME: very hacky way of checking if it was updated
        this.store.pipe(select(getNominationById(this._nomination.nominationId)), skip(1)).subscribe((result) => {
            this.close.emit(true);
        });
    }

    hasTarget() {
        return !!get(this.nomination, 'redirectionTarget', false);
    }

    onApprove() {
        this.store.dispatch(updateRedirectionStatusReq({ nominationId: this.nomination.nominationId, dto: { approved: true } }));
    }

    onDeny() {
        this.store.dispatch(updateRedirectionStatusReq({ nominationId: this.nomination.nominationId, dto: { approved: false } }));
    }
}
