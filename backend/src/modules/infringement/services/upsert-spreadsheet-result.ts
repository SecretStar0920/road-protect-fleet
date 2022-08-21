import { UploadSpreadsheetResult } from '@modules/shared/dtos/spreadsheet-upload-response.dto';
import { UpsertInfringementDto } from '@modules/infringement/controllers/upsert-infringement.dto';
import { UpsertType } from '@modules/infringement/enums/upsert-type.enum';

export class UpsertSpreadsheetResult extends UploadSpreadsheetResult<UpsertInfringementDto> {
    constructor(
        public valid: UpsertInfringementDto[] = [],
        public invalid: UpsertInfringementDto[] = [],
        public create: UpsertInfringementDto[] = [],
        public update: UpsertInfringementDto[] = [],
    ) {
        super(valid, invalid);
    }

    getFormattedCounts() {
        return {
            ...super.getFormattedCounts(),
            createCount: this.create.length,
            updateCount: this.update.length,
        };
    }

    addValid(dto: UpsertInfringementDto, type: UpsertType) {
        switch (type) {
            case UpsertType.CREATE:
                this.create.push(dto);
                break;
            case UpsertType.UPDATE:
                this.update.push(dto);
                break;
        }
        this.valid.push(dto);
    }
}
