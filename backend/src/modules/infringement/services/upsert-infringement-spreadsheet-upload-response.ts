import { SpreadsheetUploadCompleteResponse, UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { Infringement } from '../../shared/entities/infringement.entity';

export class UpsertInfringementSpreadsheetUploadResponse extends SpreadsheetUploadCompleteResponse {
    missingInfringements: Infringement[];

    static fromResults(
        results: UploadSpreadsheetResult,
        validDocumentId: number,
        invalidDocumentId: number,
        missingInfringements: Infringement[] = [],
    ): UpsertInfringementSpreadsheetUploadResponse {
        return {
            ...results.getFormattedCounts(),
            validDocumentId,
            invalidDocumentId,
            missingInfringements,
        };
    }
}
