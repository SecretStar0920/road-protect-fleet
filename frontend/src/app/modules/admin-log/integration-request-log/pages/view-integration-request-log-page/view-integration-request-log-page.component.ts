import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-integration-request-log-page',
    templateUrl: './view-integration-request-log-page.component.html',
    styleUrls: ['./view-integration-request-log-page.component.less'],
})
export class ViewIntegrationRequestLogPageComponent implements OnInit {
    integrationRequestLogId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getIntegrationRequestLogIdFromParam();
    }

    ngOnInit() {}

    getIntegrationRequestLogIdFromParam() {
        this.route.params.subscribe((params) => {
            this.integrationRequestLogId = Number(params.id);
        });
    }
}
