import { Module } from '@nestjs/common';
import { ContractController } from './controllers/contract.controller';
import { CreateContractService } from './services/create-contract.service';
import { UpdateContractService } from './services/update-contract.service';
import { GetContractService } from './services/get-contract.service';
import { GetContractsService } from './services/get-contracts.service';
import { DeleteContractService } from './services/delete-contract.service';
import { DocumentModule } from '@modules/document/document.module';
import { ContractScheduleService } from '@modules/contract/services/contract-schedule.service';
import { NominationModule } from '@modules/nomination/nomination.module';
import { ContractQueryController } from '@modules/contract/controllers/contract-query.controller';
import { BatchUpdateContractDocumentService } from '@modules/contract/services/batch-update-contract-document.service';
import { SharedModule } from '@modules/shared/shared.module';
import { FixContractService } from '@modules/contract/services/fix-contract.service';
import { ContractOcrIntegration } from '@integrations/contract/contract-ocr.integration';
import { ContractOcrController } from '@modules/contract/controllers/contract-ocr.controller';
import { GeneratedDocumentModule } from '@modules/generated-document/generated-document.module';
import { ContractOcrStatusService } from '@modules/contract/services/contract-ocr-status.service';
import { GraphingModule } from '@modules/graphing/graphing.module';

@Module({
    controllers: [ContractController, ContractOcrController, ContractQueryController],
    providers: [
        CreateContractService,
        UpdateContractService,
        GetContractService,
        GetContractsService,
        DeleteContractService,
        ContractOcrStatusService,
        ContractScheduleService,
        BatchUpdateContractDocumentService,
        FixContractService,
        ContractOcrIntegration,
    ],
    imports: [DocumentModule, GraphingModule, NominationModule, SharedModule, GeneratedDocumentModule],
    exports: [UpdateContractService, CreateContractService, ContractOcrStatusService],
})
export class ContractModule {}
