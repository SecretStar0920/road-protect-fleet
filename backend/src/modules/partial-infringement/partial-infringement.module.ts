import { Module } from '@nestjs/common';
import { PartialInfringementQueryController } from '@modules/partial-infringement/controller/partial-infringement-query.controller';
import { PartialInfringementController } from '@modules/partial-infringement/controller/partial-infringement.controller';
import { CreatePartialInfringementService } from '@modules/partial-infringement/services/create-partial-infringement.service';
import { DeletePartialInfringementService } from '@modules/partial-infringement/services/delete-partial-infringement.service';
import { PartialInfringementSpreadsheetController } from '@modules/partial-infringement/controller/partial-infringement-spreadsheet.controller';
import { CreatePartialInfringementSpreadsheetService } from '@modules/partial-infringement/services/create-partial-infringement-spreadsheet.service';
import { AntivirusService } from '@modules/shared/modules/antivirus/antivirus.service';
import { ProcessPartialInfringementService } from '@modules/partial-infringement/services/process-partial-infringement.service';
import { VerifyInfringementModule } from '@modules/infringement/verify-infringement.module';
import { ProcessPartialInfringementScheduleService } from '@modules/partial-infringement/services/process-partial-infringement-schedule.service';
import { FetchPartialInfringementsService } from '@modules/partial-infringement/services/fetch-partial-infringements.service';
import { PartialInfringementOcrController } from '@modules/partial-infringement/controller/partial-infringement-ocr.controller';
import { CreatePartialInfringementOcrService } from '@modules/partial-infringement/services/create-partial-infringement-ocr.service';
import { OcrPartialInfringementService } from '@modules/partial-infringement/services/ocr-partial-infringement.service';

@Module({
    controllers: [
        PartialInfringementController,
        PartialInfringementQueryController,
        PartialInfringementSpreadsheetController,
        PartialInfringementOcrController
    ],
    providers: [
        CreatePartialInfringementService,
        DeletePartialInfringementService,
        FetchPartialInfringementsService,
        CreatePartialInfringementSpreadsheetService,
        CreatePartialInfringementOcrService,
        OcrPartialInfringementService,
        AntivirusService,
        ProcessPartialInfringementService,
        ProcessPartialInfringementScheduleService,
    ],
    exports: [],
    imports: [VerifyInfringementModule],
})
export class PartialInfringementModule {}
