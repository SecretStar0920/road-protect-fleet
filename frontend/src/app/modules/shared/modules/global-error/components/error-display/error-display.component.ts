import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { errorNgrxHelper, ErrorState } from '@modules/shared/modules/global-error/ngrx/error.reducer';
import { select, Store } from '@ngrx/store';
import * as fromError from '../../ngrx/error.reducer';
import { isArray, isNil, isString } from 'lodash';
import { plainToClass } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface ErrorDisplayContent {
    title: string;
    messages: string[];
    severity: 'error' | 'warn' | 'info';
}

@Component({
    selector: 'rp-error-display',
    templateUrl: './error-display.component.html',
    styleUrls: ['./error-display.component.less'],
})
export class ErrorDisplayComponent implements OnInit {
    @ViewChild('errorDisplayContent', { static: true }) errorDisplayContent: TemplateRef<ErrorDisplayContent>;

    constructor(private store: Store<ErrorState>, private notification: NzNotificationService) {}

    ngOnInit() {
        this.store.pipe(select(fromError.selectUnacknowledged)).subscribe((errors) => {
            for (const error of errors) {
                let title = `That didn't work`;
                let severity = 'error';
                switch (error.raw.status) {
                    case 500:
                        title = `You've found a bug, please contact us`;
                        break;
                    case 400:
                        title = 'Invalid action';
                        severity = 'warn';
                        break;
                    default:
                        title = `That didn't work`;
                }
                let messages: string[] = [];
                const rawMessage: any = error.raw.error.message;
                if (!isNil(rawMessage)) {
                    if (isString(rawMessage)) {
                        // Standard exception from backend
                        messages = [rawMessage];
                    } else if (isArray(rawMessage)) {
                        // Class validator exception
                        const validationErrors: ValidationError[] = plainToClass(ValidationError, rawMessage);
                        messages = validationErrors.map((validationError: ValidationError) => {
                            return `${validationError.toString()}`;
                        });
                    }
                }

                this.notification.template(this.errorDisplayContent, { nzData: { title, messages, severity } });
                this.store.dispatch(errorNgrxHelper.updateOne({ item: { id: error.id, changes: { acknowledged: true } } }));
            }
        });
    }
}
