import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-job-log-page',
    templateUrl: './view-job-log-page.component.html',
    styleUrls: ['./view-job-log-page.component.less'],
})
export class ViewJobLogPageComponent implements OnInit {
    jobLogUuid: string;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getJobLogIdFromParam();
    }

    ngOnInit() {}

    getJobLogIdFromParam() {
        this.route.params.subscribe((params) => {
            this.jobLogUuid = params.id;
        });
    }
}
