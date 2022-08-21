import { Component, OnInit } from '@angular/core';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';
import { OwnershipContract } from '@modules/shared/models/entities/contract.model';
import { OwnershipContractSpreadsheetService } from '@modules/contract/modules/ownership-contract/services/ownership-contract-spreadsheet.service';
import { CreateOwnershipContractDto } from '../../services/create-ownership-contract.dto';
import { UpdateOwnershipContractDto } from '@modules/contract/modules/ownership-contract/services/update-ownership-contract.dto';

@Component({
    selector: 'rp-upload-ownership-contracts-page',
    templateUrl: './upload-ownership-contracts-page.component.html',
    styleUrls: ['./upload-ownership-contracts-page.component.less'],
})
export class UploadOwnershipContractsPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<OwnershipContract>;

    constructor(private ownershipContractSpreadsheetService: OwnershipContractSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<OwnershipContract>(
            'ownershipContract',
            {
                create: new UploadOption({
                    dto: CreateOwnershipContractDto,
                    service: this.ownershipContractSpreadsheetService,
                }),
                update: new UploadOption({
                    dto: UpdateOwnershipContractDto,
                    service: this.ownershipContractSpreadsheetService,
                }),
            },
            ['create', 'update'],
        );
    }

    ngOnInit() {}
}
