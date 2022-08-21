import { CrudRequest } from '@nestjsx/crud';
import { IdentityDto } from '@modules/shared/dtos/identity.dto';
import { XlsxService, SPREADSHEET_CELL_FORMATS, Worksheet } from '../../spreadsheet/services/xlsx.service';
import { BadRequestException } from '@nestjs/common';
import { NormalizrSchemaHelper } from '@modules/shared/normalizr/normalizr-schema-helper';
import { get } from 'lodash';
import { adjustUTCToTimezone } from '@modules/shared/helpers/timezone-conversion';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { ApiProperty } from '@nestjs/swagger';

export class AdvancedTableColumn {
    @ApiProperty()
    key: string;
    @ApiProperty()
    title: string;
    @ApiProperty({ default: true })
    isDisplaying?: boolean = true;

    // Some columns use a whole model as column key for template cells/columns. But spreadsheet needs a single value to display
    @ApiProperty()
    spreadsheetKey?: string = this.key;
    // Some columns have special formatting, such as dates or currency
    @ApiProperty({ enum: ['currency', 'date', 'number', 'json', 'default'], default: 'default' })
    spreadsheetFormat?: 'currency' | 'date' | 'number' | 'json' | 'default' = 'default';
}

/**
 * Defines methods that should be implemented for query controllers to maintain consistency
 */
export abstract class QueryController {
    protected constructor(protected xlsxService: XlsxService) {}

    protected exportLimit: number = 100000;
    abstract alias: string;

    // Req must always be first parameter
    abstract async getMany(req: CrudRequest, identity: IdentityDto);

    protected async returnGetManyAsSpreadsheet(args: any): Promise<Buffer> {
        args[0].parsed.limit = this.exportLimit;
        args[0].parsed.page = 1;
        const data = await this.getMany.apply(this, args);
        if (data.total <= 0) {
            throw new BadRequestException({ message: ERROR_CODES.E112_NoDataToExport.message() });
        }
        return this.xlsxService.createXLSXBufferNormalizedSchema(data.data, NormalizrSchemaHelper.entitySchemas[this.alias]);
    }

    protected async returnGetManyAsSimpleSpreadsheet(args: any, columns: AdvancedTableColumn[]): Promise<Buffer> {
        args[0].parsed.limit = this.exportLimit;
        args[0].parsed.page = 1;
        const data = await this.getMany.apply(this, args);
        if (data.total <= 0) {
            throw new BadRequestException({ message: ERROR_CODES.E112_NoDataToExport.message() });
        }

        // For each columns
        const worksheet: Worksheet = { sheetName: this.alias, data: [] };
        // Headings
        columns = columns.filter((column) => column.isDisplaying);

        // default timezone is Asia/Jerusalem
        const timezone = get(args, '3.req.cookies.timezone', 'Asia/Jerusalem');

        for (const dataRow of data.data) {
            const row = {};
            for (const column of columns) {
                row[column.title] = get(dataRow, column.spreadsheetKey || column.key, '--');

                if (column.spreadsheetFormat === 'date') {
                    row[column.title] = adjustUTCToTimezone(row[column.title], timezone);
                } else if (column.spreadsheetFormat === 'json') {
                    row[column.title] = JSON.stringify(row[column.title]);
                }
            }
            worksheet.data.push(row);
        }
        const workbook = await this.xlsxService.createWorkbookWithMultipleSheets([worksheet]);

        // Format types
        for (let i = 0; i < columns.length; i++) {
            const columnIndex = i;
            if (columns[i].spreadsheetFormat === 'default' || columns[i].spreadsheetFormat === 'json') {
                continue;
            }

            const formatting = SPREADSHEET_CELL_FORMATS.Israel[columns[i].spreadsheetFormat];
            this.xlsxService.setColumnFormat(workbook, worksheet.sheetName, i, formatting.format, formatting.type);
        }

        return this.xlsxService.writeWorkbookToBuffer(workbook);
    }
}
