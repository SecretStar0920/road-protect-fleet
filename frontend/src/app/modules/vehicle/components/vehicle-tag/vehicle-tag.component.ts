import { Component, Input, OnInit } from '@angular/core';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';

@Component({
    selector: 'rp-vehicle-tag',
    templateUrl: './vehicle-tag.component.html',
    styleUrls: ['./vehicle-tag.component.less'],
})
export class VehicleTagComponent implements OnInit {
    @Input() vehicle: Vehicle;

    constructor() {}

    ngOnInit() {}
}
