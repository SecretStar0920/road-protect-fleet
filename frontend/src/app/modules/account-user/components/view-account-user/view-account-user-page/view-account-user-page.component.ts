import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-account-user-page',
    templateUrl: './view-account-user-page.component.html',
    styleUrls: ['./view-account-user-page.component.less'],
})
export class ViewAccountUserPageComponent implements OnInit {
    accountUserId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getAccountUserIdFromParam();
    }

    ngOnInit() {}

    getAccountUserIdFromParam() {
        this.route.params.subscribe((params) => {
            this.accountUserId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'accountUsers']);
    }
}
