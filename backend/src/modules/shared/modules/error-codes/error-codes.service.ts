import { Injectable } from '@nestjs/common';
import { Logger } from '@logger';
import { XlsxService } from '@modules/shared/modules/spreadsheet/services/xlsx.service';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';
import { Config } from '@config/config';
import * as fs from 'fs';

@Injectable()
export class ErrorCodesService {
    constructor(private logger: Logger, protected xlsxService: XlsxService) {}

    async generateErrorCodesSpreadsheet() {
        this.logger.log({
            message: 'Generating error codes spreadsheet from the error codes constant',
            fn: this.generateErrorCodesSpreadsheet.name,
        });

        // Manipulate data
        const data = [];
        const errorKeys = Object.keys(ERROR_CODES).forEach((errorKey) => {
            data.push({
                Code: ERROR_CODES[errorKey].code,
                Message: ERROR_CODES[errorKey].message({ generatingDocumentation: true }),
            });
        });

        // To xlsx buffer and save file
        const buffer = await this.xlsxService.createXLSXBuffer(data);

        if (!fs.existsSync(Config.get.storageDirectory() + '/error-codes')) {
            try {
                fs.mkdirSync(Config.get.storageDirectory() + '/error-codes');
            } catch (e) {
                this.logger.log({
                    message: 'Could not create folder to store error codes spreadsheet',
                    detail: e,
                    fn: this.generateErrorCodesSpreadsheet.name,
                });
                return;
            }
        }
        await fs.writeFile(Config.get.storageDirectory() + '/error-codes/error-codes.xlsx', buffer, (err) => {
            if (err) throw err;

            this.logger.log({
                message: 'Error codes spreadsheet was generated',
                fn: this.generateErrorCodesSpreadsheet.name,
            });
        });

        return;
    }
}
