import { Injectable } from '@angular/core';
import * as xlsx from 'xlsx';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class ExportJsonToSheetService {
    constructor() {}

    writeDataToFile(data: any, sheetName: string, fileName: string) {
        const workbook = xlsx.utils.book_new();

        // Go through data and create sheets per nested level

        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        return xlsx.writeFile(workbook, `${moment().format('YYYY-MM-DD')} ${fileName}.xlsx`);
    }
}
