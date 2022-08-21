export class SpreadsheetUploadCompleteResponse {
    validCount: number;
    invalidCount: number;
    validDocumentId: number;
    invalidDocumentId: number;

    static fromResults(
        results: UploadSpreadsheetResult,
        validDocumentId: number,
        invalidDocumentId: number,
    ): SpreadsheetUploadCompleteResponse {
        return {
            ...results.getFormattedCounts(),
            validDocumentId,
            invalidDocumentId,
        };
    }
}

export class UploadSpreadsheetResult<T = any> {
    constructor(public valid: T[] = [], public invalid: T[] = []) {}

    getFormattedCounts() {
        return {
            validCount: this.valid.length,
            invalidCount: this.invalid.length,
        };
    }

    get counts(): { valid: number; invalid: number } {
        return { valid: this.valid.length, invalid: this.invalid.length };
    }
}
