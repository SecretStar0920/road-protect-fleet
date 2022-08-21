import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-partial-infringement-page',
    templateUrl: './view-partial-infringement-page.component.html',
    styleUrls: ['./view-partial-infringement-page.component.less'],
})
export class ViewPartialInfringementPageComponent implements OnInit {
    partialInfringementId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getPartialInfringementIdFromParam();
    }

    ngOnInit() {}

    getPartialInfringementIdFromParam() {
        this.route.params.subscribe((params) => {
            this.partialInfringementId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'partial-infringement']);
    }
}
