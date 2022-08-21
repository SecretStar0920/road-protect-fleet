import { BadRequestException } from '@nestjs/common';
import { ERROR_CODES } from '@modules/shared/modules/error-codes/error-codes.const';

export class MultipleIssuersInSpreadsheetException extends BadRequestException {
    constructor(expected: string, actual: string) {
        super({
            statusCode: 500,
            message: ERROR_CODES.E120_MultipleIssuersInSpreadsheet.message({ expected, actual }),
        });
    }
}
