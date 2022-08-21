import { SpreadsheetUploadCompleteResponse } from '@modules/shared/models/spreadsheet-upload-complete.response';
import { Infringement } from '@modules/shared/models/entities/infringement.model';

export class SpreadsheetUpsertCompleteResponse extends SpreadsheetUploadCompleteResponse {
    createCount: number;
    updateCount: number;
    missingInfringements: Infringement[];
}
