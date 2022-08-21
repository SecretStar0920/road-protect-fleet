import { Injectable } from '@nestjs/common';
import { ExportAsSpreadsheetDto } from '@modules/shared/modules/spreadsheet/controllers/spreadsheet.controller';
import { spreadsheetEntities } from '@modules/shared/modules/spreadsheet/spreadsheet-export-entities';
import * as xlsx from 'xlsx';
import { Logger } from '@logger';

@Injectable()
export class ExportEntityAsSpreadsheetService {
    constructor(private logger: Logger) {}

    async export(dto: ExportAsSpreadsheetDto) {
        const entity = spreadsheetEntities[dto.entity];
        const data = await entity.createQueryBuilder().getRawMany();
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, dto.entity);
        return xlsx.write(workbook, { type: 'buffer' });
    }

    async exportAllEntitiesToSpreadsheet() {
        const workbook = xlsx.utils.book_new();

        for (const key in spreadsheetEntities) {
            if (!spreadsheetEntities[key]) {
                continue;
            }
            const value = spreadsheetEntities[key];
            const data = await value.createQueryBuilder().getRawMany();
            const worksheet = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(workbook, worksheet, key);
        }

        return xlsx.write(workbook, { type: 'buffer' });
    }
}
