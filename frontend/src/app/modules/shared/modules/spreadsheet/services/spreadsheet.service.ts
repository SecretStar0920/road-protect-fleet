import { Injectable } from '@angular/core';
import { HttpService } from '@modules/shared/services/http/http.service';
import { tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class SpreadsheetService {
    constructor(private http: HttpService) {}

    exportEntityAsSpreadsheet(entityName: string) {
        return this.http.downloadFileWithBody(`spreadsheet/export`, { entity: entityName }).pipe(
            tap((result) => {
                saveAs(result.file, result.filename);
            }),
        );
    }

    exportAllAsSpreadsheet() {
        return this.http.downloadFileWithBody(`spreadsheet/export/all`, {}).pipe(
            tap((result) => {
                saveAs(result.file, result.filename);
            }),
        );
    }
}
