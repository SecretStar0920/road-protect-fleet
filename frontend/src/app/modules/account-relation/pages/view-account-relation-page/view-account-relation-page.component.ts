import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-account-relation-page',
    templateUrl: './view-account-relation-page.component.html',
    styleUrls: ['./view-account-relation-page.component.less'],
})
export class ViewAccountRelationPageComponent implements OnInit {
    accountRelationId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getAccountRelationIdFromParam();
    }

    ngOnInit() {}

    getAccountRelationIdFromParam() {
        this.route.params.subscribe((params) => {
            this.accountRelationId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'account-relations']);
    }
}
