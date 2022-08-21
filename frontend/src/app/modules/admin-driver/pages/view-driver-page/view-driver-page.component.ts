import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-driver-page',
    templateUrl: './view-driver-page.component.html',
    styleUrls: ['./view-driver-page.component.less'],
})
export class ViewDriverPageComponent implements OnInit {
    driverId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getDriverIdFromParam();
    }

    ngOnInit() {}

    getDriverIdFromParam() {
        this.route.params.subscribe((params) => {
            this.driverId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'driver']);
    }
}
