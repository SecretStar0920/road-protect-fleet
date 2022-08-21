import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-nomination-page',
    templateUrl: './view-nomination-page.component.html',
    styleUrls: ['./view-nomination-page.component.less'],
})
export class ViewNominationPageComponent implements OnInit {
    nominationId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getNominationIdFromParam();
    }

    ngOnInit() {}

    getNominationIdFromParam() {
        this.route.params.subscribe((params) => {
            this.nominationId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'nominations']);
    }
}
