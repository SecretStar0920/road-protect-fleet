import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { ExcelDataType, WorkBook } from 'xlsx';
import * as flatten from 'flat';
import { normalize, schema } from 'normalizr';
import { forEach, isNil, values } from 'lodash';
import { Logger } from '@logger';
import { MulterFile } from '@modules/shared/models/multer-file.model';
import { SpreadsheetDateConverterHelper } from '@modules/shared/modules/spreadsheet/helpers/spreadsheet-date-converter.helper';

export interface Worksheet {
    sheetName: string;
    data: any[];
}

export const SPREADSHEET_CELL_FORMATS = {
    Israel: {
        currency: { format: '[$ ₪]#,##0.00', type: 'n' },
        date: { format: 'dd/mm/yyyy hh:mm:ss', type: 'd' },
        number: { format: 'Standard', type: 'n' },
    },
};

@Injectable()
export class XlsxService {
    async createXLSXBuffer(data: any, sheetName: string = 'sheet'): Promise<Buffer> {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        return this.writeWorkbookToBuffer(workbook);
    }

    async createWorkbookWithMultipleSheets(worksheets: Worksheet[]): Promise<WorkBook> {
        const workbook = xlsx.utils.book_new();
        for (let index = 0; index < worksheets.length; index++) {
            const worksheet = xlsx.utils.json_to_sheet(worksheets[index].data);
            xlsx.utils.book_append_sheet(workbook, worksheet, worksheets[index].sheetName || `Sheet ${index}`);
        }
        return workbook;
    }

    async writeWorkbookToBuffer(workbook: WorkBook) {
        return xlsx.write(workbook, { type: 'buffer' });
    }

    async createXLSXBufferWithMultipleSheets(worksheets: Worksheet[]): Promise<Buffer> {
        const workbook = await this.createWorkbookWithMultipleSheets(worksheets);
        return this.writeWorkbookToBuffer(workbook);
    }

    async createXLSXBufferDepthFlattened(data: any[], depth: number = 1, delimiter = ' > ', sheetName: string = 'sheet'): Promise<Buffer> {
        const sheets: { sheetName: string; data: any }[] = [];
        data = data.map((dataItem) => flatten(dataItem, { delimiter }));
        const workbook = xlsx.utils.book_new();
        for (const sheet of sheets) {
            const worksheet = xlsx.utils.json_to_sheet(sheet.data);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
        }
        return this.writeWorkbookToBuffer(workbook);
    }

    async createXLSXBufferNormalizedSchema(data: any[], normalizrSchema: schema.Entity): Promise<Buffer> {
        const sheets: { sheetName: string; data: any[] }[] = []; // Sheet data
        const normalizedData = normalize(data, [normalizrSchema]); // Normalized data

        forEach(normalizedData.entities, (value, key) => {
            // Flatten the values
            const entityValues = values(value).map((dataItem) => flatten(dataItem, { delimiter: ' > ' }));

            // Make sure main schema is first sheet and in order as returned by DB
            if (key === normalizrSchema.key) {
                try {
                    const resultOrder: any[] = normalizedData.result;
                    sheets.unshift({ sheetName: key, data: resultOrder.map((id) => flatten(value[id], { delimiter: ' > ' })) });
                } catch (e) {
                    Logger.instance.error({
                        message: 'Failed to order primary result sheet by input order',
                        detail: e,
                        fn: this.createXLSXBufferNormalizedSchema.name,
                    });
                    sheets.unshift({ sheetName: key, data: entityValues });
                }
            } else {
                sheets.push({ sheetName: key, data: entityValues });
            }
        });

        const workbook = xlsx.utils.book_new();
        for (const sheet of sheets) {
            const worksheet = xlsx.utils.json_to_sheet(sheet.data);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
        }
        return this.writeWorkbookToBuffer(workbook);
    }

    async extractJsonFromBuffer(file: MulterFile): Promise<any[][]> {
        const workbook = xlsx.read(file.buffer, {
            type: 'buffer',
            cellDates: true,
        });

        const firstSheet = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[firstSheet];
        worksheet = SpreadsheetDateConverterHelper.create().convertDatesToString(worksheet);

        return xlsx.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: true,
        }) as any[][];
    }

    //////////////////////////////////////////////////////////////////
    // MANIPULATION
    //////////////////////////////////////////////////////////////////

    setColumnFormat(workbook: WorkBook, sheetName: string, columnIndex: number, format: string, type: ExcelDataType) {
        // const columnIndex = xlsx.utils.decode_col(column); // B -> 1
        const worksheet = workbook.Sheets[sheetName];
        const range = xlsx.utils.decode_range(worksheet['!ref']); // range of s => starting cell, e => ending cell eg s: (c: 0, r: 0), r: (c: 13, r: 12)
        for (let i = range.s.r + 1; i <= range.e.r; ++i) {
            // find the data cell (range.s.r + 1 skips the header row of the worksheet)
            const ref = xlsx.utils.encode_cell({ r: i, c: columnIndex });
            // if the particular row did not contain data for the column, the cell will not be generated
            if (!worksheet[ref]) continue;
            // assign the format, type and then run the format to get the formatted value in-case of CSV export
            this.setCellFormatAndType(workbook, sheetName, ref, format, type);
        }
    }

    setCellFormatAndType(workbook: WorkBook, sheetName: string, ref: string, format: string, type: ExcelDataType) {
        const worksheet = workbook.Sheets[sheetName];
        // if the data type is date and a null value is received then don't set the format
        if (isNil(worksheet[ref].v) && type === 'd') {
            return;
        }
        worksheet[ref].z = format;
        worksheet[ref].t = type;
    }

    addSum(workbook: WorkBook, sheetName: string, columnIndex: number, endRow?: number) {
        const worksheet = workbook.Sheets[sheetName];
        const range = xlsx.utils.decode_range(worksheet['!ref']); // range of s => starting cell, e => ending cell eg s: (c: 0, r: 0), r: (c: 13, r: 12)
        if (isNil(endRow)) {
            endRow = this.getEndRow(workbook, sheetName);
        }
        const ref = xlsx.utils.encode_cell({ r: endRow + 1, c: columnIndex });
        const startRef = xlsx.utils.encode_cell({ r: 1, c: columnIndex });
        const endRef = xlsx.utils.encode_cell({ r: endRow, c: columnIndex });
        const totalRef = xlsx.utils.encode_cell({ r: endRow + 1, c: 0 });
        worksheet[ref] = { f: `SUM(${startRef}:${endRef})` };
        worksheet[totalRef] = { v: 'Total' };
        range.e.r++;
        worksheet['!ref'] = xlsx.utils.encode_range(range);
    }

    addTotal(workbook: WorkBook, sheetName: string, columnIndex: number, totalValue: number | string, endRow?: number) {
        const worksheet = workbook.Sheets[sheetName];
        const range = xlsx.utils.decode_range(worksheet['!ref']); // range of s => starting cell, e => ending cell eg s: (c: 0, r: 0), r: (c: 13, r: 12)
        if (isNil(endRow)) {
            endRow = this.getEndRow(workbook, sheetName);
        }
        const ref = xlsx.utils.encode_cell({ r: endRow + 1, c: columnIndex });
        const totalRef = xlsx.utils.encode_cell({ r: endRow + 1, c: 0 });
        worksheet[ref] = { v: totalValue };
        worksheet[totalRef] = { v: 'סה"כ' };
        range.e.r++;
        worksheet['!ref'] = xlsx.utils.encode_range(range);
    }

    getEndRow(workbook: WorkBook, sheetName: string) {
        const worksheet = workbook.Sheets[sheetName];
        const range = xlsx.utils.decode_range(worksheet['!ref']); // range of s => starting cell, e => ending cell eg s: (c: 0, r: 0), r: (c: 13, r: 12)
        return range.e.r;
    }
}
