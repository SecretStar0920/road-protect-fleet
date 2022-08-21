import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@modules/shared/models/entities/location.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'rp-view-locations',
    templateUrl: './view-locations.component.html',
    styleUrls: ['./view-locations.component.less'],
})
export class ViewLocationsComponent implements OnInit, OnDestroy {
    locations: Location[];
    zoom: number = 5;

    @Input() action: TemplateRef<any>;
    private destroy$ = new Subject();

    constructor() {}

    ngOnInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
