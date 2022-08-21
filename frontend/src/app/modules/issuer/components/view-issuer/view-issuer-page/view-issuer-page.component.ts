import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-issuer-page',
    templateUrl: './view-issuer-page.component.html',
    styleUrls: ['./view-issuer-page.component.less'],
})
export class ViewIssuerPageComponent implements OnInit {
    issuerId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getIssuerIdFromParam();
    }

    ngOnInit() {}

    getIssuerIdFromParam() {
        this.route.params.subscribe((params) => {
            this.issuerId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'issuers']);
    }
}
