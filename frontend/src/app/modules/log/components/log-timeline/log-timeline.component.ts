import { Component, Input, OnInit } from '@angular/core';
import { LogPriority, LogType } from '@modules/shared/models/entities/log.model';
import { isEmpty } from 'lodash';
import { LogHistory } from '@modules/shared/models/entities/log-history.model';
import { LogKeysMapper } from '@modules/log/components/log-timeline/log-keys.mapper';

@Component({
    selector: 'rp-log-timeline',
    templateUrl: './log-timeline.component.html',
    styleUrls: ['./log-timeline.component.less'],
})
export class LogTimelineComponent implements OnInit {
    @Input() logs: LogHistory[];
    @Input() isVisible: boolean;
    logType = LogType;

    constructor(private logKeysMapper: LogKeysMapper) {}

    ngOnInit() {}

    checkPriority(priority: LogPriority) {
        return priority === LogPriority.High;
    }

    isDifferencesEmpty(differences): boolean {
        return isEmpty(differences);
    }

    printKey(object: any) {
        return Object.keys(object);
    }

    keyType(key: string): string {
        if (key.includes('date') || key.includes('Date')) {
            return 'date';
        } else if (key.includes('Due') || key.includes('amount') || key.includes('Amount') || key.includes('total')) {
            return 'currency';
        }
    }

    printKeyName(key: string): string {
        return this.logKeysMapper.getKeyTranslation(key);
    }
}
