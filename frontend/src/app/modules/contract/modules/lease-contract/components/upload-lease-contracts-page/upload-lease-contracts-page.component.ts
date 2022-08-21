import { Component, OnInit } from '@angular/core';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';
import { CreateLeaseContractDto } from '@modules/contract/modules/lease-contract/services/create-lease-contract.dto';
import { LeaseContract } from '@modules/shared/models/entities/contract.model';
import { LeaseContractSpreadsheetService } from '@modules/contract/modules/lease-contract/services/lease-contract-spreadsheet.service';
import { UpdateLeaseContractDto } from '../../services/update-lease-contract.dto';

@Component({
    selector: 'rp-upload-lease-contracts-page',
    templateUrl: './upload-lease-contracts-page.component.html',
    styleUrls: ['./upload-lease-contracts-page.component.less'],
})
export class UploadLeaseContractsPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<LeaseContract>;

    constructor(private leaseContractSpreadsheetService: LeaseContractSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<LeaseContract>(
            'leaseContract',
            {
                create: new UploadOption({
                    dto: CreateLeaseContractDto,
                    service: this.leaseContractSpreadsheetService,
                }),
                update: new UploadOption({
                    dto: UpdateLeaseContractDto,
                    service: this.leaseContractSpreadsheetService,
                }),
            },
            [
                'create',
                // 'update',
            ],
        );
    }

    ngOnInit() {}
}
