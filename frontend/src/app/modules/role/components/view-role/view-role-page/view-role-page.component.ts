import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-role-page',
    templateUrl: './view-role-page.component.html',
    styleUrls: ['./view-role-page.component.less'],
})
export class ViewRolePageComponent implements OnInit {
    roleId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getRoleIdFromParam();
    }

    ngOnInit() {}

    getRoleIdFromParam() {
        this.route.params.subscribe((params) => {
            this.roleId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'roles']);
    }
}
