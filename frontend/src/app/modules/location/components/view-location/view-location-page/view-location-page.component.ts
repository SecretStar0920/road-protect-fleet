import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'rp-view-location-page',
    templateUrl: './view-location-page.component.html',
    styleUrls: ['./view-location-page.component.less'],
})
export class ViewLocationPageComponent implements OnInit {
    locationId: number;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.getLocationIdFromParam();
    }

    ngOnInit() {}

    getLocationIdFromParam() {
        this.route.params.subscribe((params) => {
            this.locationId = Number(params.id);
        });
    }

    onDelete() {
        this.router.navigate(['/home', 'locations']);
    }
}
