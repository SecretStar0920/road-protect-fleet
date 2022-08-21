import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { AccountRelation } from '@modules/shared/models/entities/account-relation.model';
import { Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccountRelationApiService } from '@modules/account-relation/services/account-relation-api.service';

@Component({
    selector: 'rp-upload-relations-spreadsheet-modal',
    templateUrl: './upload-relations-spreadsheet-modal.component.html',
    styleUrls: ['./upload-relations-spreadsheet-modal.component.less'],
})
export class UploadRelationsSpreadsheetModalComponent implements OnInit, OnDestroy {

    uploadState: ElementStateModel<AccountRelation[]> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(
        private modal: NzModalRef,
        private message: NzMessageService
    ) {}

    ngOnInit() {

    }

    onComplete(state: ElementStateModel<AccountRelation[]>) {
        this.uploadState = state;

        if (this.uploadState.hasSucceeded()) {
            this.message.success(this.uploadState.successResult().message);
            this.modal.close(this.uploadState);
        } else if (this.uploadState.hasFailed()) {
            this.message.error(this.uploadState.failedResult().message);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
