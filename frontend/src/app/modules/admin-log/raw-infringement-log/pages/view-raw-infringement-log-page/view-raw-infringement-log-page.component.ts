import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'rp-view-raw-infringement-log-page',
    templateUrl: './view-raw-infringement-log-page.component.html',
    styleUrls: ['./view-raw-infringement-log-page.component.less'],
})
export class ViewRawInfringementLogPageComponent implements OnInit {
    rawInfringementLogId: number;

    constructor(private route: ActivatedRoute) {
        this.getRawInfringementLogIdFromParam();
    }

    ngOnInit() {}

    getRawInfringementLogIdFromParam() {
        this.route.params.subscribe((params) => {
            this.rawInfringementLogId = Number(params.id);
        });
    }
}
