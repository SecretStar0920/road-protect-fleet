import * as xlsx from 'xlsx';

/**
 * This helper runs through an XLSX WorkSheet and converts any date columns to
 * a string so that we can interpret them correctly (not as numbers).
 */
export class SpreadsheetDateConverterHelper {
    static create() {
        return new SpreadsheetDateConverterHelper();
    }

    convertDatesToString(sheet: xlsx.WorkSheet): xlsx.WorkSheet {
        const validKeys = Object.keys(sheet)
            .filter((key) => sheet.hasOwnProperty(key))
            // Only pull out the spreadsheet cells, there is other metadata that
            // we want to ignore here.
            .filter((key) => /[A-Z]+[0-9]+/.test(key));
        for (const validKey of validKeys) {
            if (sheet[validKey].t !== 'd') {
                // It's not a date
                continue;
            }
            // Set the type to string
            sheet[validKey].t = 's';
            // Set the value to what is displayed on the sheet
            sheet[validKey].v = sheet[validKey].w;
        }
        return sheet;
    }
}
