import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@modules/shared/models/entities/location.model';

@Component({
    selector: 'rp-view-short-location',
    templateUrl: './view-short-location.component.html',
    styleUrls: ['./view-short-location.component.less'],
})
export class ViewShortLocationComponent implements OnInit {
    @Input() location: Location;
    @Input() reason: string;
    @Input() truncate: boolean = true;

    constructor() {}

    ngOnInit() {}
}
