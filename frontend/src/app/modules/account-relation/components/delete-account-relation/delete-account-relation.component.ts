import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-delete-account-relation',
    templateUrl: './delete-account-relation.component.html',
    styleUrls: ['./delete-account-relation.component.less'],
})
export class DeleteAccountRelationComponent implements OnInit {
    @Input() accountRelationId: number;

    deleteAccountRelationState: ElementStateModel<AccountRelation> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<AccountRelation>> = new EventEmitter();

    constructor(private accountRelationService: AccountRelationApiService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deleteAccountRelationState.submit();
        this.accountRelationService.deleteAccountRelation(this.accountRelationId).subscribe(
            (accountRelation) => {
                this.deleteAccountRelationState.onSuccess('Successfully deleted Account relation', accountRelation);
                this.message.success(this.deleteAccountRelationState.successResult().message);
                this.delete.emit(this.deleteAccountRelationState);
            },
            (error) => {
                this.deleteAccountRelationState.onFailure('Failed to delete Account relation', error);
                this.message.error(this.deleteAccountRelationState.failedResult().message);
            },
        );
    }
}
