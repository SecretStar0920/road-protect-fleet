import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { RequestInformationLog } from '@modules/shared/models/entities/request-information-log.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { RequestInformationLogService } from '@modules/admin-log/request-information-log/services/request-information-log.service';
import { NGXLogger } from 'ngx-logger';
import i18next from 'i18next';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-update-request-information-log',
    templateUrl: './update-request-information-log.component.html',
    styleUrls: ['./update-request-information-log.component.less'],
})
export class UpdateRequestInformationLogComponent implements OnInit, OnDestroy {
    @Input() requestInformationLog: RequestInformationLog;
    private destroy$ = new Subject();

    updateRequestInformationLogForm: FormGroup;
    updateRequestInformationLogState: ElementStateModel<RequestInformationLog> = new ElementStateModel();
    @Output() complete: EventEmitter<ElementStateModel<RequestInformationLog>> = new EventEmitter();

    get f() {
        return this.updateRequestInformationLogForm.controls;
    }

    constructor(private requestInformationLogService: RequestInformationLogService, private fb: FormBuilder, private logger: NGXLogger) {
        this.updateRequestInformationLogForm = this.fb.group({
            responseReceivedDate: new FormControl(null),
            responseReceived: new FormControl(true),
        });
    }

    ngOnInit() {
        this.updateRequestInformationLogForm.controls.responseReceivedDate.setValue(moment().toDate());
    }

    onUpdateRequestInformationLog() {
        this.updateRequestInformationLogState.submit();
        this.requestInformationLogService
            .updateRequestInformationLog(this.requestInformationLog.requestInformationLogId, this.updateRequestInformationLogForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.logger.info('Successfully updated RequestInformationLog', result);
                    this.updateRequestInformationLogState.onSuccess(i18next.t('update-request-information-log.success'), result);
                    this.complete.emit(this.updateRequestInformationLogState);
                },
                (error) => {
                    this.logger.error('Failed to update RequestInformationLog', error);
                    this.updateRequestInformationLogState.onFailure(i18next.t('update-request-information-log.fail'), error.error);
                    this.complete.emit(this.updateRequestInformationLogState);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
