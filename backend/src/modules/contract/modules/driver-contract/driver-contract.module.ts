import { Module } from '@nestjs/common';
import { UpdateDriverContractService } from '@modules/contract/modules/driver-contract/services/update-driver-contract.service';
import { GetDriverContractsService } from '@modules/contract/modules/driver-contract/services/get-driver-contracts.service';
import { ContractModule } from '@modules/contract/contract.module';
import { SharedModule } from '@modules/shared/shared.module';
import { DriverContractController } from '@modules/contract/modules/driver-contract/controllers/driver-contract.controller';
import { DeleteDriverContractService } from '@modules/contract/modules/driver-contract/services/delete-driver-contract.service';
import { FindExistingDriverContractService } from '@modules/contract/modules/driver-contract/services/find-existing-driver-contract.service';
import { CreateDriverContractService } from '@modules/contract/modules/driver-contract/services/create-driver-contract.service';
import { GetDriverContractService } from '@modules/contract/modules/driver-contract/services/get-driver-contract.service';
import { DriverContractSpreadsheetController } from '@modules/contract/modules/driver-contract/controllers/driver-contract-spreadsheet.controller';
import { CreateDriverContractSpreadsheetService } from '@modules/contract/modules/driver-contract/services/create-driver-contract-spreadsheet.service';
import { UpdateDriverContractSpreadsheetService } from '@modules/contract/modules/driver-contract/services/update-driver-contract-spreadsheet.service';

@Module({
    controllers: [DriverContractController, DriverContractSpreadsheetController],
    providers: [
        UpdateDriverContractService,
        GetDriverContractService,
        GetDriverContractsService,
        DeleteDriverContractService,
        UpdateDriverContractSpreadsheetService,
        CreateDriverContractSpreadsheetService,
        FindExistingDriverContractService,
        CreateDriverContractService,
    ],
    exports: [CreateDriverContractService],
    imports: [ContractModule, SharedModule],
})
export class DriverContractModule {}
