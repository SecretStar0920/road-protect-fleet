import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    requestInformationLogNgrxHelper,
    RequestInformationLogState,
} from '@modules/admin-log/request-information-log/ngrx/request-information-log.reducer';
import { select, Store } from '@ngrx/store';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';
import { takeUntil, tap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { RequestInformationLogService } from '@modules/admin-log/request-information-log/services/request-information-log.service';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Subject } from 'rxjs';
import { UserType } from '@modules/shared/models/entities/user.model';
import i18next from 'i18next';
import { UpdateRequestInformationLogComponent } from '@modules/admin-log/request-information-log/components/update-request-information-log/update-request-information-log.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'rp-view-request-information-log',
    templateUrl: './view-request-information-log.component.html',
    styleUrls: ['./view-request-information-log.component.less'],
})
export class ViewRequestInformationLogComponent implements OnInit, OnDestroy {
    @Input() requestInformationLogId: number;
    requestInformationLog: RequestInformationLog;
    responseReceivedModal: NzModalRef<any>;

    updateRequestInformationLogState: ElementStateModel<RequestInformationLog> = new ElementStateModel();
    @Output() delete: EventEmitter<ElementStateModel<RequestInformationLog>> = new EventEmitter();

    private destroy$ = new Subject();

    userTypes = UserType;

    constructor(
        private store: Store<RequestInformationLogState>,
        private logger: NGXLogger,
        private requestInformationLogService: RequestInformationLogService,
        private modalService: NzModalService,
    ) {}

    ngOnInit() {
        this.getRequestInformationLog();
    }

    getRequestInformationLog() {
        this.store
            .pipe(
                select(requestInformationLogNgrxHelper.selectEntityById(this.requestInformationLogId), takeUntil(this.destroy$)),
                tap((requestInformationLog) => {
                    if (!requestInformationLog) {
                        this.logger.debug('RequestInformationLog not found on store, querying for it');
                        this.requestInformationLogService
                            .getRequestInformationLog(this.requestInformationLogId)
                            .pipe(takeUntil(this.destroy$))
                            .subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.requestInformationLog = result;
            });
    }

    onUpdate() {
        this.responseReceivedModal = this.modalService.create({
            nzTitle: i18next.t('request_information_log.log_response'),
            nzContent: UpdateRequestInformationLogComponent,
            nzFooter: null,
            nzComponentParams: {
                requestInformationLog: this.requestInformationLog,
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
