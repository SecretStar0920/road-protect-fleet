import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { PartialInfringement, PartialInfringementStatus } from '@modules/shared/models/entities/partial-infringement.model';
import {
    partialInfringementNgrxHelper,
    PartialInfringementState,
} from '@modules/admin-partial-infringement/ngrx/partial-infringement.reducer';
import { PartialInfringementService } from '@modules/admin-partial-infringement/services/partial-infringement.service';
import { UserType } from '@modules/shared/models/entities/user.model';
import { ElementStateModel } from '@modules/shared/models/element-state.model';

@Component({
    selector: 'rp-view-partial-infringement',
    templateUrl: './view-partial-infringement.component.html',
    styleUrls: ['./view-partial-infringement.component.less'],
})
export class ViewPartialInfringementComponent implements OnInit, OnDestroy {
    @Input() partialInfringementId: number;
    partialInfringement: PartialInfringement;
    userTypes = UserType;
    partialInfringementStatus = PartialInfringementStatus;
    @Output() delete: EventEmitter<ElementStateModel<PartialInfringement>> = new EventEmitter();

    private destroy$ = new Subject();

    constructor(
        private store: Store<PartialInfringementState>,
        private logger: NGXLogger,
        private partialInfringementService: PartialInfringementService,
    ) {}

    ngOnInit() {
        this.getPartialInfringement();
    }

    getPartialInfringement() {
        this.store
            .pipe(
                select(partialInfringementNgrxHelper.selectEntityById(this.partialInfringementId), takeUntil(this.destroy$)),
                tap((partialInfringement) => {
                    if (!partialInfringement) {
                        this.logger.debug('PartialInfringement not found on store, querying for it');
                        this.partialInfringementService.getPartialInfringement(this.partialInfringementId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.partialInfringement = result;
            });
    }

    onDelete(deleteState: ElementStateModel<PartialInfringement>) {
        this.delete.emit(deleteState);
    }

    processedStatus(status: PartialInfringementStatus) {
        return !(status === PartialInfringementStatus.Pending || status === PartialInfringementStatus.Queued);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
