import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'rp-request-information-logs-page',
    templateUrl: './request-information-logs-page.component.html',
    styleUrls: ['./request-information-logs-page.component.less'],
})
export class RequestInformationLogsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewRequestInformationLog(requestInformationLogId: number) {
        if (!requestInformationLogId) {
            this.logger.warn('Tried to view an RequestInformationLog without an requestInformationLog id');
            return;
        }
        this.router.navigate(['/home', 'request-information-log', 'view', requestInformationLogId]);
    }
}
