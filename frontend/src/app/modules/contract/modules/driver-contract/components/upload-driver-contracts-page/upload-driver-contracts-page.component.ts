import { Component, OnInit } from '@angular/core';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';
import { DriverContract } from '@modules/shared/models/entities/contract.model';
import { DriverContractSpreadsheetService } from '@modules/contract/modules/driver-contract/services/driver-contract-spreadsheet.service';
import { CreateDriverContractDto } from '@modules/contract/modules/driver-contract/services/create-driver-contract.dto';
import { UpdateDriverContractDto } from '@modules/contract/modules/driver-contract/services/update-driver-contract.dto';

@Component({
    selector: 'rp-upload-driver-contracts-page',
    templateUrl: './upload-driver-contracts-page.component.html',
    styleUrls: ['./upload-driver-contracts-page.component.less'],
})
export class UploadDriverContractsPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<DriverContract>;

    constructor(private driverContractSpreadsheetService: DriverContractSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<DriverContract>(
            'DriverContract',
            {
                create: new UploadOption({
                    dto: CreateDriverContractDto,
                    service: this.driverContractSpreadsheetService,
                }),
                update: new UploadOption({
                    dto: UpdateDriverContractDto,
                    service: this.driverContractSpreadsheetService,
                }),
            },
            ['create', 'update'],
        );
    }

    ngOnInit() {}
}
