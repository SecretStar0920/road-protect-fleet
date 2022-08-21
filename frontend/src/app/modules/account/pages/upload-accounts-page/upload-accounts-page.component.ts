import { Component, OnInit } from '@angular/core';
import { CreateAccountSpreadsheetDto } from '@modules/account/services/create-account-v1.dto';
import { Account } from '@modules/shared/models/entities/account.model';
import { AccountSpreadsheetService } from '@modules/account/services/account-spreadsheet.service';
import { EntitySpreadsheetUpload, UploadOption } from '@modules/shared/models/entity-spreadsheet.upload';

@Component({
    selector: 'rp-upload-accounts-page',
    templateUrl: './upload-accounts-page.component.html',
    styleUrls: ['./upload-accounts-page.component.less'],
})
export class UploadAccountsPageComponent implements OnInit {
    entitySpreadsheetUpload: EntitySpreadsheetUpload<Account>;

    constructor(private accountSpreadsheetService: AccountSpreadsheetService) {
        this.entitySpreadsheetUpload = new EntitySpreadsheetUpload<Account>(
            'account',
            {
                create: new UploadOption({ dto: CreateAccountSpreadsheetDto, service: this.accountSpreadsheetService }),
                // update: {
                //     dto: UpdateAccountDto,
                //     service: this.accountSpreadsheetService
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
