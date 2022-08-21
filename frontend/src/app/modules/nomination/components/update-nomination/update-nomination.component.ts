import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { NGXLogger } from 'ngx-logger';
import { AppState } from '../../../../ngrx/app.reducer';
import { Store } from '@ngrx/store';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';

@Component({
    selector: 'rp-update-nomination',
    templateUrl: './update-nomination.component.html',
    styleUrls: ['./update-nomination.component.less'],
})
export class UpdateNominationComponent implements OnInit {
    @Input() nomination: Nomination;

    updateNominationForm: FormGroup;
    updateNominationState: ElementStateModel<Nomination> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<Nomination>> = new EventEmitter();

    get f() {
        return this.updateNominationForm.controls;
    }

    constructor(
        private nominationService: NominationService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private store: Store<AppState>,
    ) {}

    ngOnInit() {
        this.updateNominationForm = this.fb.group({
            account: new FormControl('', Validators.required),
            infringement: new FormControl('', Validators.required),
        });
    }

    onUpdateNomination() {
        this.updateNominationState.submit();
        this.store.dispatch(nominationNgrxHelper.updateOneReq({ id: this.nomination.nominationId, dto: this.updateNominationForm.value }));
        // TODO: state and update
        // this.nominationService.updateNomination(this.nomination.nominationId, this.updateNominationForm.value).subscribe(
        //     result => {
        //         this.logger.info('Successfully updated Nomination', result);
        //         this.updateNominationState.onSuccess('Successfully updated nomination', result);
        //         this.complete.emit(this.updateNominationState);
        //     },
        //     error => {
        //         this.logger.error('Failed to update Nomination', error);
        //         this.updateNominationState.onFailure('Failed to update nomination', error.error);
        //         this.complete.emit(this.updateNominationState);
        //     }
        // );
    }
}
