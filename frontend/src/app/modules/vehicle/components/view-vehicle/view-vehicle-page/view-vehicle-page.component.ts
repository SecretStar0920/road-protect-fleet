import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-vehicle-page',
    templateUrl: './view-vehicle-page.component.html',
    styleUrls: ['./view-vehicle-page.component.less'],
})
export class ViewVehiclePageComponent implements OnInit {
    vehicleId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getVehicleIdFromParam();
    }

    ngOnInit() {}

    getVehicleIdFromParam() {
        this.route.params.subscribe((params) => {
            this.vehicleId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'vehicles']);
    }
}
