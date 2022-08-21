import { Component, OnInit } from '@angular/core';
import { CreateIssuerDto } from '@modules/issuer/services/create-issuer.dto';
import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { IssuerSpreadsheetService } from '@modules/issuer/services/issuer-spreadsheet.service';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';

@Component({
    selector: 'rp-upload-issuers-page',
    templateUrl: './upload-issuers-page.component.html',
    styleUrls: ['./upload-issuers-page.component.less'],
})
export class UploadIssuersPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<Issuer>;

    constructor(private issuerSpreadsheetService: IssuerSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<Issuer>(
            'issuer',
            {
                create: new UploadOption({
                    dto: CreateIssuerDto,
                    service: this.issuerSpreadsheetService,
                }),
                // update: {
                //     dto: UpdateIssuerDto,
                //     service: this.issuerSpreadsheetService
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
