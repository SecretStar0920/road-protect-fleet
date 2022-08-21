import { Component, OnInit } from '@angular/core';
import { UserType } from '@modules/shared/models/entities/user.model';

@Component({
    selector: 'rp-admin-reports-page',
    templateUrl: './admin-reports-page.component.html',
    styleUrls: ['./admin-reports-page.component.less'],
})
export class AdminReportsPageComponent implements OnInit {
    userTypes = UserType;

    constructor() {}

    ngOnInit() {}
}
