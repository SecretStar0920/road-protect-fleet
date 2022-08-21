import { Module } from '@nestjs/common';
import { LeaseContractController } from './controllers/lease-contract.controller';
import { CreateLeaseContractService } from './services/create-lease-contract.service';
import { UpdateLeaseContractService } from './services/update-lease-contract.service';
import { GetLeaseContractService } from './services/get-lease-contract.service';
import { GetLeaseContractsService } from './services/get-lease-contracts.service';
import { DeleteLeaseContractService } from './services/delete-lease-contract.service';
import { ContractModule } from '@modules/contract/contract.module';
import { LeaseContractSpreadsheetController } from '@modules/contract/modules/lease-contract/controllers/lease-contract-spreadsheet.controller';
import { CreateLeaseContractSpreadsheetService } from '@modules/contract/modules/lease-contract/services/create-lease-contract-spreadsheet.service';
import { UpdateLeaseContractSpreadsheetService } from '@modules/contract/modules/lease-contract/services/update-lease-contract-spreadsheet.service';
import { FindExistingLeaseContractService } from '@modules/contract/modules/lease-contract/services/find-existing-lease-contract.service';
import { SharedModule } from '@modules/shared/shared.module';

@Module({
    controllers: [LeaseContractController, LeaseContractSpreadsheetController],
    providers: [
        CreateLeaseContractService,
        UpdateLeaseContractService,
        GetLeaseContractService,
        GetLeaseContractsService,
        DeleteLeaseContractService,
        CreateLeaseContractSpreadsheetService,
        UpdateLeaseContractSpreadsheetService,
        FindExistingLeaseContractService,
    ],
    exports: [CreateLeaseContractService],
    imports: [ContractModule, SharedModule],
})
export class LeaseContractModule {}
