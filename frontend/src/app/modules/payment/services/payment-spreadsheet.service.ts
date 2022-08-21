import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { Observable } from 'rxjs';
import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { SpreadsheetService } from '@modules/shared/services/spreadsheet-service/spreadsheet.service';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/models/spreadsheet-upload-complete.response';

@Injectable({
    providedIn: 'root',
})
export class PaymentSpreadsheetService extends SpreadsheetService {
    constructor(private http: HttpService) {
        super();
    }

    verify(file: File, body: SpreadsheetUploadDto): Observable<SpreadsheetUploadCompleteResponse> {
        return this.http.uploadFile('payment/spreadsheet/verify', file, body);
    }

    upload(file: File, body: SpreadsheetUploadDto): Observable<SpreadsheetUploadCompleteResponse> {
        return this.http.uploadFile('payment/spreadsheet/upload', file, body);
    }

    uploadSocket(file: File, body: SpreadsheetUploadDto) {
        return this.http.uploadFile('payment/spreadsheet/upload', file, body);
    }
}
