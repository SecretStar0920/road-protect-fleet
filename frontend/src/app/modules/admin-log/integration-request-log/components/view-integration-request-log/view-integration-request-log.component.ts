import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    integrationRequestLogNgrxHelper,
    IntegrationRequestLogState,
} from '@modules/admin-log/integration-request-log/ngrx/integration-request-log.reducer';
import { IntegrationRequestLogService } from '@modules/admin-log/integration-request-log/services/integration-request-log.service';
import { IntegrationRequestLog } from '@modules/shared/models/entities/integration-request-log.model';
import { select, Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'rp-view-integration-request-log',
    templateUrl: './view-integration-request-log.component.html',
    styleUrls: ['./view-integration-request-log.component.less'],
})
export class ViewIntegrationRequestLogComponent implements OnInit, OnDestroy {
    @Input() integrationRequestLogId: number;
    integrationRequestLog: IntegrationRequestLog;

    private destroy$ = new Subject();

    constructor(
        private store: Store<IntegrationRequestLogState>,
        private logger: NGXLogger,
        private integrationRequestLogService: IntegrationRequestLogService,
    ) {}

    ngOnInit() {
        this.getIntegrationRequestLog();
    }

    getIntegrationRequestLog() {
        this.store
            .pipe(
                select(integrationRequestLogNgrxHelper.selectEntityById(this.integrationRequestLogId), takeUntil(this.destroy$)),
                tap((integrationRequestLog) => {
                    if (!integrationRequestLog) {
                        this.logger.debug('IntegrationRequestLog not found on store, querying for it');
                        this.integrationRequestLogService.getIntegrationRequestLog(this.integrationRequestLogId).subscribe();
                    }
                }),
            )
            .subscribe((result) => {
                this.integrationRequestLog = result;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
