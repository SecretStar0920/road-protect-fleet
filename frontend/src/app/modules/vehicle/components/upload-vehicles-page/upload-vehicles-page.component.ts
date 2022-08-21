import { Component, OnInit } from '@angular/core';
import { CreateVehicleDto } from '@modules/vehicle/services/create-vehicle.dto';
import { Vehicle } from '@modules/shared/models/entities/vehicle.model';
import { VehicleSpreadsheetService } from '@modules/vehicle/services/vehicle-spreadsheet.service';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';

@Component({
    selector: 'rp-upload-vehicles-page',
    templateUrl: './upload-vehicles-page.component.html',
    styleUrls: ['./upload-vehicles-page.component.less'],
})
export class UploadVehiclesPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<Vehicle>;

    constructor(private vehicleSpreadsheetService: VehicleSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<Vehicle>(
            'vehicle',
            {
                create: new UploadOption({ dto: CreateVehicleDto, service: this.vehicleSpreadsheetService }),
                // update: {
                //     dto: UpdateVehicleDto,
                //     service: this.vehicleSpreadsheetService
                // }
            },
            [
                'create',
                // 'update',
            ],
        );
    }

    ngOnInit() {}
}
