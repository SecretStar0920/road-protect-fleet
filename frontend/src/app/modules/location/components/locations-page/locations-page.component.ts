import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateLocationModalComponent } from '@modules/location/components/create-location/create-location-modal/create-location-modal.component';
import { Router } from '@angular/router';
import i18next from 'i18next';

@Component({
    selector: 'rp-locations-page',
    templateUrl: './locations-page.component.html',
    styleUrls: ['./locations-page.component.less'],
})
export class LocationsPageComponent implements OnInit {
    viewLocationModal: NzModalRef<any>;
    createLocationModal: NzModalRef<any>;

    constructor(private logger: NGXLogger, private modalService: NzModalService, private router: Router) {}

    ngOnInit() {}

    onViewLocation(locationId: number) {
        if (!locationId) {
            this.logger.warn('Tried to view an Location without an location id');
            return;
        }
        this.router.navigate(['/home', 'locations', 'view', locationId]);
        // Modal version
        // this.viewLocationModal = this.modalService.create({
        //     nzTitle: 'View Location',
        //     nzContent: ViewLocationModalComponent,
        //     nzComponentParams: {
        //         locationId
        //     },
        //     nzFooter: null
        // });
    }

    onCreateLocation() {
        this.createLocationModal = this.modalService.create({
            nzTitle: i18next.t('locations-page.create_location'),
            nzContent: CreateLocationModalComponent,
            nzFooter: null,
        });
    }
}
