import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-raw-infringement-logs-page',
    templateUrl: './raw-infringement-logs-page.component.html',
    styleUrls: ['./raw-infringement-logs-page.component.less'],
})
export class RawInfringementLogsPageComponent implements OnInit {
    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}
}
