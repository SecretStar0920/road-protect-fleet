import { Module } from '@nestjs/common';
import { TaavuraController } from './controllers/taavura.controller';
import { LeaseContractModule } from '@modules/contract/modules/lease-contract/lease-contract.module';
import { VehicleModule } from '@modules/vehicle/vehicle.module';
import { ContractModule } from '@modules/contract/contract.module';
import { DocumentModule } from '@modules/document/document.module';
import { TaavuraVehicleContractService } from '@modules/partners/modules/taavura/services/taavura-vehicle-contract.service';
import { OwnershipContractModule } from '@modules/contract/modules/ownership-contract/ownership-contract.module';

@Module({
    imports: [ContractModule, LeaseContractModule, OwnershipContractModule, VehicleModule, DocumentModule],
    providers: [TaavuraVehicleContractService],
    controllers: [TaavuraController],
})
export class TaavuraModule {}
