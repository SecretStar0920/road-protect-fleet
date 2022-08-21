import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { Workbook } from 'exceljs';

@Injectable()
export class ExcelJsService {
    async createWorkbookFromBuffer(buffer: Buffer) {
        const workbook = new Excel.Workbook();
        return await workbook.xlsx.load(buffer);
    }

    async writeWorkbookToBuffer(workbook: Workbook) {
        return workbook.xlsx.writeBuffer();
    }

    async addTotalBorder(workbook: Workbook, sheetName: string) {
        const worksheet = workbook.getWorksheet(sheetName);
        const row = worksheet.getRow(worksheet.rowCount);
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.style = Object.create(cell.style);
            cell.style.border = {
                top: {
                    style: 'thick',
                },
            };
        });
    }

    async makeRtl(workbook: Workbook, sheetName: string) {
        const worksheet = workbook.getWorksheet(sheetName);
        const view = worksheet.views.pop();
        worksheet.columns.forEach((col) => {
            col.alignment = { horizontal: 'right', readingOrder: 'rtl', wrapText: true };
        });
        view.rightToLeft = true;
        worksheet.views = [view];
    }

    async adjustColumnWidthAutomatically(workbook: Workbook, sheetName: string) {
        const worksheet = workbook.getWorksheet(sheetName);
        // Loop through each column
        worksheet.columns.forEach((column) => {
            let columnWidth = 15;
            // Getting max length of each cell
            column.eachCell((cell, rowNumber) => {
                const columnLength = `${cell.value}`.length;
                if (columnLength > columnWidth) {
                    columnWidth = columnLength;
                }
            });
            column.width = Math.min(Math.round(columnWidth), 50);
            return column;
        });
    }
}
