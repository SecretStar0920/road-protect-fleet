import { Component, OnInit } from '@angular/core';
import { Infringement } from '@modules/shared/models/entities/infringement.model';
import { InfringementSpreadsheetService } from '@modules/infringement/services/infringement-spreadsheet.service';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';
import { UpsertInfringementDto } from '@modules/infringement/services/upsert-infringement.dto';
import { ManualInfringementRedirectionDto } from '@modules/infringement/services/manual-infringement-redirection.dto';

@Component({
    selector: 'rp-upload-infringements-page',
    templateUrl: './upload-infringements-page.component.html',
    styleUrls: ['./upload-infringements-page.component.less'],
})
export class UploadInfringementsPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<Infringement>;

    constructor(private infringementSpreadsheetService: InfringementSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<Infringement>(
            'infringement',
            {
                upsert: new UploadOption({
                    dto: UpsertInfringementDto,
                    service: this.infringementSpreadsheetService,
                    useTranslationForHeading: true,
                }),
                manualRedirection: new UploadOption({
                    dto: ManualInfringementRedirectionDto,
                    service: this.infringementSpreadsheetService,
                }),
            },
            ['upsert', 'manualRedirection'],
        );
    }

    ngOnInit() {}
}
