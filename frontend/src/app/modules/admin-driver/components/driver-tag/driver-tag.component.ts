import { Component, Input, OnInit } from '@angular/core';
import { Driver } from '@modules/shared/models/entities/driver.model';

@Component({
    selector: 'rp-driver-tag',
    templateUrl: './driver-tag.component.html',
    styleUrls: ['./driver-tag.component.less'],
})
export class DriverTagComponent implements OnInit {
    @Input() driver: Driver;

    constructor() {}

    ngOnInit() {}
}
