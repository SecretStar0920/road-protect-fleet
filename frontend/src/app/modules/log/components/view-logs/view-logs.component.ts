import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { GetLogsParameters, LogService } from '@modules/log/services/log.service';
import { select, Store } from '@ngrx/store';
import * as logSelectors from '@modules/log/ngrx/log.selectors';
import * as logActions from '@modules/log/ngrx/log.actions';
import { LogState } from '@modules/log/ngrx/log.reducer';
import { ElementStateModel } from '@modules/shared/models/element-state.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import i18next from 'i18next';
import { LogHistory } from '@modules/shared/models/entities/log-history.model';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'rp-view-logs',
    templateUrl: './view-logs.component.html',
    styleUrls: ['./view-logs.component.less'],
})
export class ViewLogsComponent implements OnInit, OnDestroy {
    logs: LogHistory[];
    getLogsState: ElementStateModel = new ElementStateModel();

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();
    isVisible: boolean;
    showAll: boolean = false;
    loaded$: Observable<boolean>;

    // Relations
    @Input() vehicleId: number;
    @Input() accountId: number;
    @Input() userId: number;
    @Input() infringementId: number;

    constructor(private logService: LogService, private store: Store<LogState>, private logger: NGXLogger) {}

    ngOnInit() {
        this.store.dispatch(logActions.setLogLoadedState({ newState: false }));
        this.loaded$ = this.store.select(logSelectors.areLogsLoaded).pipe(takeUntil(this.destroy$));
        this.initialiseLogs();
        this.getLogs();
    }

    initialiseLogs() {
        const params: GetLogsParameters = {
            vehicleId: this.vehicleId ? this.vehicleId : null,
            userId: this.userId ? this.userId : null,
            accountId: this.accountId ? this.accountId : null,
            infringementId: this.infringementId ? this.infringementId : null,
        };
        this.store.dispatch(logActions.requestLogs(params));
    }

    getLogs() {
        this.getLogsState.submit();
        this.store
            .pipe(select(this.showAll ? logSelectors.selectAll : logSelectors.getHighPriorityLogs), takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.getLogsState.onSuccess(i18next.t('view-logs.success'), result);
                    this.logs = result;
                },
                (error) => {
                    this.getLogsState.onFailure(i18next.t('view-logs.fail'), error.error);
                },
            );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
