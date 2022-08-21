import { Issuer } from '@modules/shared/models/entities/issuer.model';
import { FileUploadData } from '@modules/infringement/ngrx/file-upload-data.interface';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/models/spreadsheet-upload-complete.response';
import { SpreadsheetUpsertCompleteResponse } from '@modules/infringement/dtos/spreadsheet-upsert-complete-response';
import { RedirectMissingInfringementsResponseDto } from '@modules/infringement/services/redirect-missing-infringements-response.dto';
import { Account } from '@modules/shared/models/entities/account.model';

export interface AdminInfringementUpload {
    issuers: Issuer[];
    account: Account;
    fileUpload: FileUploadData;
    verifyResponse: SpreadsheetUploadCompleteResponse;
    uploadResponse: SpreadsheetUpsertCompleteResponse;
    missingInfringements: {
        loading: boolean;
        submitResponse: RedirectMissingInfringementsResponseDto;
        skipRedirections: boolean;
    };
}
