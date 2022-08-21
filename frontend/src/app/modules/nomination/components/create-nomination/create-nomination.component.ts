import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { AppState } from '../../../../ngrx/app.reducer';
import { Store } from '@ngrx/store';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';

@Component({
    selector: 'rp-create-nomination',
    templateUrl: './create-nomination.component.html',
    styleUrls: ['./create-nomination.component.less'],
})
export class CreateNominationComponent implements OnInit {
    createNominationForm: FormGroup;
    createNominationState: ElementStateModel<Nomination> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    get f() {
        return this.createNominationForm.controls;
    }

    constructor(
        private nominationService: NominationService,
        private fb: FormBuilder,
        private logger: NGXLogger,
        private store: Store<AppState>,
    ) {}

    ngOnInit() {
        this.createNominationForm = this.fb.group({
            account: new FormControl('', Validators.required),
            infringement: new FormControl('', Validators.required),
        });
    }

    onCreateNomination() {
        this.createNominationState.submit();
        this.store.dispatch(nominationNgrxHelper.createOneReq({ dto: this.createNominationForm.value }));
        // TODO: state feedback and success
        // this.nominationService.createNomination(this.createNominationForm.value).subscribe(
        //     result => {
        //         this.logger.info('Successfully created Nomination', result);
        //         this.createNominationState.onSuccess('Successfully created Nomination', result);
        //         this.complete.emit(this.createNominationState);
        //     },
        //     error => {
        //         this.logger.error('Failed to create Nomination', error);
        //         this.createNominationState.onFailure('Failed to create Nomination', error.error);
        //         this.complete.emit(this.createNominationState);
        //     }
        // );
    }
}
