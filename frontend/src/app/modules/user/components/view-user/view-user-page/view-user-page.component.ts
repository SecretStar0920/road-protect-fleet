import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-user-page',
    templateUrl: './view-user-page.component.html',
    styleUrls: ['./view-user-page.component.less'],
})
export class ViewUserPageComponent implements OnInit {
    userId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getUserIdFromParam();
    }

    ngOnInit() {}

    getUserIdFromParam() {
        this.route.params.subscribe((params) => {
            this.userId = params.id;
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'users']);
    }
}
