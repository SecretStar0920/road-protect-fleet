import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rp-view-current-permissions-button',
    templateUrl: './view-current-permissions-button.component.html',
    styleUrls: ['./view-current-permissions-button.component.less'],
})
export class ViewCurrentPermissionsButtonComponent implements OnInit {
    viewPermissions: boolean = false;

    constructor() {}

    ngOnInit() {}

    toggleViewPermissions() {
        this.viewPermissions = !this.viewPermissions;
    }
}
