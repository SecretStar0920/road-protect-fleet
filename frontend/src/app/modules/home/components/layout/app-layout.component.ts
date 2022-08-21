import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@modules/home/services/layout.service';
import { SocketManagementService } from '@modules/shared/modules/realtime/services/socket-management.service';

@Component({
    selector: 'rp-app-layout',
    templateUrl: './app-layout.component.html',
    styleUrls: ['./app-layout.component.less'],
})
export class AppLayoutComponent implements OnInit {
    constructor(public layoutService: LayoutService, private socketManagementService: SocketManagementService) {}

    ngOnInit() {}
}
