import { Module } from '@nestjs/common';
import { XlsxService } from './services/xlsx.service';
import { ExportEntityAsSpreadsheetService } from '@modules/shared/modules/spreadsheet/services/export-entity-as-spreadsheet.service';
import { SpreadsheetController } from '@modules/shared/modules/spreadsheet/controllers/spreadsheet.controller';
import { ExcelJsService } from '@modules/shared/modules/spreadsheet/services/excel-js.service';

@Module({
    providers: [ExportEntityAsSpreadsheetService, XlsxService, ExcelJsService],
    controllers: [SpreadsheetController],
    exports: [XlsxService, ExcelJsService],
})
export class SpreadsheetModule {}
