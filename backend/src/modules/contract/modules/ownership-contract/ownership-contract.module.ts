import { Module } from '@nestjs/common';
import { OwnershipContractController } from './controllers/ownership-contract.controller';
import { CreateOwnershipContractService } from './services/create-ownership-contract.service';
import { UpdateOwnershipContractService } from './services/update-ownership-contract.service';
import { GetOwnershipContractService } from './services/get-ownership-contract.service';
import { GetOwnershipContractsService } from './services/get-ownership-contracts.service';
import { DeleteOwnershipContractService } from './services/delete-ownership-contract.service';
import { ContractModule } from '@modules/contract/contract.module';
import { OwnershipContractSpreadsheetController } from '@modules/contract/modules/ownership-contract/controllers/ownership-contract-spreadsheet.controller';
import { CreateOwnershipContractSpreadsheetService } from '@modules/contract/modules/ownership-contract/services/create-ownership-contract-spreadsheet.service';
import { FindExistingOwnershipContractService } from '@modules/contract/modules/ownership-contract/services/find-existing-ownership-contract.service';
import { SharedModule } from '@modules/shared/shared.module';
import { UpdateOwnershipContractSpreadsheetService } from '@modules/contract/modules/ownership-contract/services/update-ownership-contract-spreadsheet.service';

@Module({
    controllers: [OwnershipContractController, OwnershipContractSpreadsheetController],
    providers: [
        UpdateOwnershipContractService,
        GetOwnershipContractService,
        GetOwnershipContractsService,
        DeleteOwnershipContractService,
        UpdateOwnershipContractSpreadsheetService,
        CreateOwnershipContractSpreadsheetService,
        FindExistingOwnershipContractService,
        CreateOwnershipContractService,
    ],
    exports: [CreateOwnershipContractService],
    imports: [ContractModule, SharedModule],
})
export class OwnershipContractModule {}
