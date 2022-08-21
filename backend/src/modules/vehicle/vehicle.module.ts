import { Module } from '@nestjs/common';
import { VehicleController } from './controllers/vehicle.controller';
import { CreateVehicleService } from './services/create-vehicle.service';
import { UpdateVehicleService } from './services/update-vehicle.service';
import { GetVehicleService } from './services/get-vehicle.service';
import { GetVehiclesService } from './services/get-vehicles.service';
import { DeleteVehicleService } from './services/delete-vehicle.service';
import { GetVehiclesForAccountService } from '@modules/vehicle/services/get-vehicles-for-account.service';
import { VehicleSpreadsheetController } from '@modules/vehicle/controllers/vehicle-spreadsheet.controller';
import { VehicleSpreadsheetService } from '@modules/vehicle/services/vehicle-spreadsheet.service';
import { VehicleQueryController } from '@modules/vehicle/controllers/vehicle-query.controller';
import { ContractModule } from '@modules/contract/contract.module';
import { AtgVehicleSyncService } from '@modules/vehicle/services/atg-vehicle-sync.service';
import { VehicleAutomationIntegration } from '@integrations/automation/vehicle/vehicle.automation-integration';
import { GraphingModule } from '@modules/graphing/graphing.module';

@Module({
    controllers: [VehicleController, VehicleSpreadsheetController, VehicleQueryController],
    providers: [
        CreateVehicleService,
        UpdateVehicleService,
        GetVehicleService,
        GetVehiclesService,
        GetVehiclesForAccountService,
        DeleteVehicleService,
        VehicleSpreadsheetService,
        AtgVehicleSyncService,
        VehicleAutomationIntegration,
    ],
    imports: [ContractModule, GraphingModule],
    exports: [CreateVehicleService, GetVehicleService],
})
export class VehicleModule {}
