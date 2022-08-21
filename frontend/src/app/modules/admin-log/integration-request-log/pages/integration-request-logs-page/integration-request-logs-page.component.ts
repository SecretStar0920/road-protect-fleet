import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewIntegrationRequestLogModalComponent } from '@modules/admin-log/integration-request-log/components/view-integration-request-log/view-integration-request-log-modal/view-integration-request-log-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NGXLogger } from 'ngx-logger';

@Component({
    selector: 'rp-integration-request-logs-page',
    templateUrl: './integration-request-logs-page.component.html',
    styleUrls: ['./integration-request-logs-page.component.less'],
})
export class IntegrationRequestLogsPageComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
