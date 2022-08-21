import { IntegrationRequestLogger } from '@modules/integration-request/services/integration-request-logger.service';
import { Module } from '@nestjs/common';
import { OldFleetSystemInfringementDataService } from '@modules/partners/modules/old-fleet-system/services/old-fleet-system-infringement-data.service';
import { OldFleetDataController } from './controllers/old-fleet-data.controller';
import { RawInfringementModule } from '@modules/raw-infringement/raw-infringement.module';
import { OldFleetSystemScheduledSyncService } from '@modules/partners/modules/old-fleet-system/services/old-fleet-system-scheduled-sync.service';

@Module({
    providers: [OldFleetSystemInfringementDataService, OldFleetSystemScheduledSyncService, IntegrationRequestLogger],
    controllers: [OldFleetDataController],
    imports: [RawInfringementModule],
})
export class OldFleetSystemModule {}
