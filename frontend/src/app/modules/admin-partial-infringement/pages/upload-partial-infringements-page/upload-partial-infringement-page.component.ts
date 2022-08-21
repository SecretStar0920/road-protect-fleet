import { Component, OnInit } from '@angular/core';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';
import { PartialInfringementSpreadsheetService } from '@modules/admin-partial-infringement/services/partial-infringement-spreadsheet.service';
import { PartialInfringement } from '@modules/shared/models/entities/partial-infringement.model';
import { CreatePartialInfringementSpreadsheetDto } from '@modules/admin-partial-infringement/services/create-partial-infringement-spreadsheet.dto';

@Component({
    selector: 'rp-upload-partial-infringement-page',
    templateUrl: './upload-partial-infringement-page.component.html',
    styleUrls: ['./upload-partial-infringement-page.component.less'],
})
export class UploadPartialInfringementPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<PartialInfringement>;

    constructor(private partialInfringementSpreadsheetService: PartialInfringementSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<PartialInfringement>(
            'partialInfringement',
            {
                create: new UploadOption({
                    dto: CreatePartialInfringementSpreadsheetDto,
                    service: this.partialInfringementSpreadsheetService,
                }),
            },
            ['create'],
        );
    }

    ngOnInit() {}
}
