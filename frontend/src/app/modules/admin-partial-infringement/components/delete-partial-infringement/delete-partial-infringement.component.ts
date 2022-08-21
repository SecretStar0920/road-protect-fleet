import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import i18next from 'i18next';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { PartialInfringementService } from '@modules/admin-partial-infringement/services/partial-infringement.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'rp-delete-partial-infringement',
    templateUrl: './delete-partial-infringement.component.html',
    styleUrls: ['./delete-partial-infringement.component.less'],
})
export class DeletePartialInfringementComponent implements OnInit, OnDestroy {
    @Input() partialInfringementId: number;
    private destroy$ = new Subject();

    deletePartialInfringementState: ElementStateModel<PartialInfringement> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<PartialInfringement>> = new EventEmitter();

    constructor(private partialInfringementService: PartialInfringementService, private message: NzMessageService) {}

    ngOnInit() {}

    onDelete() {
        this.deletePartialInfringementState.submit();
        this.partialInfringementService
            .deletePartialInfringement(this.partialInfringementId)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (partialInfringement) => {
                    this.deletePartialInfringementState.onSuccess(i18next.t('delete-partial-infringement.success'), partialInfringement);
                    this.message.success(this.deletePartialInfringementState.successResult().message);
                    this.delete.emit(this.deletePartialInfringementState);
                },
                (error) => {
                    this.deletePartialInfringementState.onFailure(i18next.t('delete-partial-infringement.fail'), error);
                    this.message.error(this.deletePartialInfringementState.failedResult().message);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
