import { Module } from '@nestjs/common';
import { IssuerController } from './controllers/issuer.controller';
import { CreateIssuerService } from './services/create-issuer.service';
import { UpdateIssuerService } from './services/update-issuer.service';
import { GetIssuerService } from './services/get-issuer.service';
import { GetIssuersService } from './services/get-issuers.service';
import { DeleteIssuerService } from './services/delete-issuer.service';
import { IssuerSpreadsheetService } from '@modules/issuer/services/issuer-spreadsheet.service';
import { IssuerSpreadsheetController } from '@modules/issuer/controllers/issuer-spreadsheet.controller';
import { IssuerQueryController } from '@modules/issuer/controllers/issuer-query.controller';
import { GetIssuerExternalCodeService } from './services/get-issuer-external-code.service';

@Module({
    controllers: [IssuerController, IssuerSpreadsheetController, IssuerQueryController],
    providers: [
        CreateIssuerService,
        UpdateIssuerService,
        GetIssuerService,
        GetIssuersService,
        DeleteIssuerService,
        IssuerSpreadsheetService,
        GetIssuerExternalCodeService,
    ],
    imports: [],
})
export class IssuerModule {}
