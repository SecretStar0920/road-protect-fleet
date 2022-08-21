export class SpreadsheetUploadCompleteResponse {
    validCount: number;
    invalidCount: number;
    validDocumentId: number;
    invalidDocumentId: number;
}

export class SpreadsheetUploadResponse {
    eventName: string; // uuid
}
