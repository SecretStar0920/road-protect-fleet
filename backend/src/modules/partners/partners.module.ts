import { Module } from '@nestjs/common';
import { TaavuraModule } from './modules/taavura/taavura.module';
import { OldFleetSystemModule } from '@modules/partners/modules/old-fleet-system/old-fleet-system.module';
import { AtgModule } from './modules/atg/atg.module';

@Module({
    imports: [TaavuraModule, OldFleetSystemModule, AtgModule],
    exports: [TaavuraModule, OldFleetSystemModule, AtgModule],
})
export class PartnersModule {}
