import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Nomination } from '@modules/shared/models/entities/nomination.model';
import { NominationService } from '@modules/nomination/services/nomination.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ngrx/app.reducer';
import { nominationNgrxHelper } from '@modules/nomination/ngrx/nomination.reducer';

@Component({
    selector: 'rp-delete-nomination',
    templateUrl: './delete-nomination.component.html',
    styleUrls: ['./delete-nomination.component.less'],
})
export class DeleteNominationComponent implements OnInit {
    @Input() nominationId: number;

    deleteNominationState: ElementStateModel<Nomination> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<Nomination>> = new EventEmitter();

    constructor(private nominationService: NominationService, private message: NzMessageService, private store: Store<AppState>) {}

    ngOnInit() {}

    onDelete() {
        this.deleteNominationState.submit();
        this.store.dispatch(nominationNgrxHelper.deleteOne({ id: `${this.nominationId}` }));
        // TODO: state and update
        // this.nominationService.deleteNomination(this.nominationId).subscribe(
        //     nomination => {
        //         this.deleteNominationState.onSuccess('Successfully deleted Nomination', nomination);
        //         this.message.success(this.deleteNominationState.successResult().message);
        //         this.delete.emit(this.deleteNominationState);
        //     },
        //     error => {
        //         this.deleteNominationState.onFailure('Failed to delete Nomination', error);
        //         this.message.error(this.deleteNominationState.failedResult().message);
        //     }
        // );
    }
}
