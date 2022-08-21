import { Component, OnInit } from '@angular/core';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';
import { DriverSpreadsheetService } from '@modules/admin-driver/services/driver-spreadsheet.service';
import { CreateDriverDto } from '@modules/admin-driver/services/create-driver.dto';
import { Driver } from '@modules/shared/models/entities/driver.model';

@Component({
    selector: 'rp-upload-driver-page',
    templateUrl: './upload-driver-page.component.html',
    styleUrls: ['./upload-driver-page.component.less'],
})
export class UploadDriverPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<Driver>;

    constructor(private driverSpreadsheetService: DriverSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<Driver>(
            'Driver',
            {
                create: new UploadOption({
                    dto: CreateDriverDto,
                    service: this.driverSpreadsheetService,
                }),
            },
            ['create'],
        );
    }

    ngOnInit() {}
}
