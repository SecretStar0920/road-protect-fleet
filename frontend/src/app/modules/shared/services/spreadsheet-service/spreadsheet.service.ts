import { SpreadsheetUploadDto } from '@modules/shared/dtos/spreadsheet-upload.dto';
import { Observable } from 'rxjs';
import { SpreadsheetUploadCompleteResponse } from '@modules/shared/models/spreadsheet-upload-complete.response';

export abstract class SpreadsheetService {
    abstract verify(file: File, body: SpreadsheetUploadDto): Observable<SpreadsheetUploadCompleteResponse>;

    abstract upload(file: File, body: SpreadsheetUploadDto): Observable<SpreadsheetUploadCompleteResponse>;

    abstract uploadSocket(file: File, body: SpreadsheetUploadDto): Observable<void>;
}
