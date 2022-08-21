import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'rp-view-request-information-log-page',
    templateUrl: './view-request-information-log-page.component.html',
    styleUrls: ['./view-request-information-log-page.component.less'],
})
export class ViewRequestInformationLogPageComponent implements OnInit, OnDestroy {
    requestInformationLogId: number;
    private destroy$ = new Subject();

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getRequestInformationLogIdFromParam();
    }

    ngOnInit() {}

    getRequestInformationLogIdFromParam() {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            this.requestInformationLogId = Number(params.id);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
