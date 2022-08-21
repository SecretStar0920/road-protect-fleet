import { WorkBook } from 'xlsx';

export interface FileUploadData {
    sheetHeadings: string[];
    spreadsheetFile: File;
    spreadsheet: WorkBook;
    spreadsheetData: any[][];
    selectedSheetName: string;
    files: File[];
}
