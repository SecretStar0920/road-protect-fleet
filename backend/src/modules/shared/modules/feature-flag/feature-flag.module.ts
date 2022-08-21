import { Module } from '@nestjs/common';
import { FeatureFlagGuard } from '@modules/shared/modules/feature-flag/guards/feature-flag.guard';

@Module({
    providers: [FeatureFlagGuard],
    exports: [FeatureFlagGuard],
})
export class FeatureFlagModule {}
